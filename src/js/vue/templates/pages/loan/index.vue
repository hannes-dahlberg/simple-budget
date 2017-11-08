<template>
    <div class="container">
        <mortgage-modal id="mortgage_modal"></mortgage-modal>
        <div class="row">
            <div class="col-3">
                <button v-if="false" type="button" class="btn btn-primary" data-toggle="modal" data-target="#mortgage_modal">
                    Launch demo modal
                </button>
                <form novalidate v-on:submit.prevent="saveLoan">
                    <div class="form-group">
                        <input class="form-control" ref="loan.label" type="text" v-model="loan.label" placeholder="Etikett" />
                    </div>
                    <div class="form-group">
                        <div class="input-group">
                            <input class="form-control" type="text" v-model="loan.amount" placeholder="Skuld" />
                            <span class="input-group-addon">
                                <span>kr</span>
                            </span>
                        </div>
                    </div>
                    <div v-for="payment in loan.payments">
                        <div class="form-group">
                            <input class="form-control" type="text" v-model="payment.start" placeholder="Från" />
                        </div>
                        <div class="form-group pt-3 mb-0">
                            <label for="payment.recurrency">Betala per:</label>
                            <selectize v-model="payment.recurrency" :options="loanPaymentRecurenciesSelectize" :allowNone="false"></selectize>
                        </div>
                        <div class="form-group">
                            <label for="loan.paymentRecurrency">Betalning</label>
                            <selectize v-model="payment.type" :options="loanPaymentTypesSelectize" :allowNone="false"></selectize>
                        </div>
                        <div class="form-group">
                            <div v-if="payment.type != 'variable'" class="input-group">
                                <input class="form-control" type="text" v-model="payment.fixedAmount" placeholder="Fast belopp" />
                                <span class="input-group-addon">
                                    <span>kr/period</span>
                                </span>
                            </div>
                        </div>
                        <div v-if="payment.type == 'variable' || payment.type == 'fixed_with_interest'" class="form-group">
                            <label>Ränta</label><br />
                            <label>
                                <input type="radio" v-model="payment.interestType" value="percentage">
                                Procent
                            </label>
                            <label>
                                <input type="radio" v-model="payment.interestType" value="value">
                                Värde
                            </label>
                            <div class="input-group">
                                <input class="form-control" type="text" v-model="payment.interest" placeholder="Ränta">
                                <span class="input-group-addon">
                                    <span v-if="payment.interestType == 'percentage'">%</span>
                                    <span v-else>kr/period</span>
                                </span>
                            </div>
                        </div>
                        <div v-if="payment.type == 'variable' || payment.type == 'fixed_with_amort'" class="form-group">
                            <label>Amortering</label><br />
                            <label>
                                <input type="radio" v-model="payment.amortType" value="percentage">
                                Procent
                            </label>
                            <label>
                                <input type="radio" v-model="payment.amortType" value="value">
                                Värde
                            </label>
                            <div class="input-group">
                                <input class="form-control" type="text" v-model="payment.amort" placeholder="Amortering">
                                <span class="input-group-addon">
                                    <span v-if="payment.amortType == 'percentage'">%</span>
                                    <span v-else>kr/period</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <span v-if="loan.index === null">Lägg till</span>
                        <span v-else>Spara</span>
                    </button>
                    <button v-if="loan.index !== null" class="btn btn-default" v-on:click="resetLoan">Återställ</button>
                </form>
            </div>
            <div class="col-9">
                <transactions-modal id="transactions_modal" :transactions="transactions" :loan-data="loanData"></transactions-modal>
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Etikett</th>
                            <th>Skuld</th>
                            <th>Från</th>
                            <th>Ränta</th>
                            <th>Amortering</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(loan, index) in loans" v-on:click.prevent="showPayments(index)">
                            <td>{{ loan.label }}</td>
                            <td class="text-right">{{ $store.getters.getFormatedAmount(loan.amount) }}</td>
                            <td v-if="loan.payments.length > 1">Varierat</td>
                            <td v-else class="text-right">{{ loan.payments[0].start }}</td>
                            <td v-if="loan.payments.length > 1" colspan="2">Varierat</td>
                            <td v-if="loan.payments.length == 1 && (['fixed_with_interest', 'fixed_with_amort'].findIndex(item => item == loan.payments[0].type) != -1)"  class="text-right" colspan="2">
                                {{ $store.getters.getFormatedAmount(loan.payments[0].fixedAmount) }}
                                <span v-if="loan.payments[0].type == 'fixed_with_interest'">
                                    ({{ loan.payments[0].interestType == 'percentage' ? loan.payments[0].interest + '%' : $store.getters.getFormatedAmount(loan.payments[0].interest) }} ränta)
                                </span>
                                <span v-if="loan.payments[0].type == 'fixed_with_amort'">
                                    ({{ loan.payments[0].amortType == 'percentage' ? loan.payments[0].amort + '%' : $store.getters.getFormatedAmount(loan.payments[0].amort) }} amortering)
                                </span>
                            </td>
                            <td v-if="loan.payments.length == 1 && loan.payments[0].type == 'variable'" class="text-right">
                                {{ loan.payments[0].interestType == 'percentage' ? loan.payments[0].interest + '%' : $store.getters.getFormatedAmount(loan.payments[0].interest) }}
                            </td>
                            <td v-if="loan.payments.length == 1 && loan.payments[0].type == 'variable'" class="text-right">
                                {{ loan.payments[0].amortType =='percentage' ? loan.payments[0].amort + '%' : $store.getters.getFormatedAmount(loan.payments[0].amort) }}
                            </td>
                            <td class="text-center">
                                <a class="text-success" href="" v-on:click.prevent="editLoan($event, index)"><i class="fa fa-pencil" aria-hidden="true"></i></a>
                                <a class="text-danger" href="" v-on:click.prevent="deleteLoan($event, index)"><i class="fa fa-times" aria-hidden="true"></i></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
    import selectize from '../../components/selectize'
    import mortgageModal from './components/mortgage'
    import transactionsModal from './components/transactions'
    export default {
        components: { selectize, mortgageModal, transactionsModal },
        data() {
            return {
                editLoanIndex: null,
                loan: {
                    id: null,
                    label: null,
                    amount: null,
                    payments: [],
                    data: null
                },
                transactions: null,
                loanData: null
            }
        },
        computed: {
            loans() {
                return this.$store.getters.getLoans
            },
            loanPaymentRecurencies() {
                return this.$store.getters.getLoanPaymentRecurrencies
            },
            loanPaymentRecurenciesSelectize() {
                return this.loanPaymentRecurencies.map(item => { return { value: item, text: this.$t('loan.payment_recurrencies.' + item) } })
            },
            loanPaymentTypes() {
                return this.$store.getters.getLoanPaymentTypes
            },
            loanPaymentTypesSelectize() {
                return this.loanPaymentTypes.map(item => { return { value: item, text: this.$t('loan.payment_types.' + item) } })
            }
        },
        mounted() {
            this.addPayment()
        },
        validators: {

        },
        methods: {
            saveLoan() {
                if(this.editLoanIndex !== null) {
                    this.$store.commit('updateLoan', {
                        index: this.editLoanIndex,
                        data: this.loan,
                        fixedPayments: this.$store.getters.getOneLoanResult(this.loan.id)
                    });
                } else {
                    this.$store.commit('addLoan', this.loan)
                }
                this.resetLoan();
            },
            editLoan(event, index) {
                event.stopImmediatePropagation()
                if(this.loans[index]) {
                    this.editLoanIndex = index
                    this.loan.id = this.loans[index].id
                    this.loan.label = this.loans[index].label
                    this.loan.amount = this.loans[index].amount
                    this.loan.payments = this.loans[index].payments.map(item => {
                        var payment = {}
                        Object.keys(item).forEach(key => {
                            payment[key] = item[key]
                        });
                        return payment
                    })
                }
            },
            deleteLoan(index) {
                event.stopImmediatePropagation()
                this.$store.commit('deleteLoan', { index, unitName: ['interestResult', 'amortResult'] });
                if(this.editLoanIndex == index) {
                    this.resetLoan();
                }
            },
            addPayment() {
                this.loan.payments.push({
                    start: null,
                    end: null,
                    type: 'variable',
                    interest: null,
                    interestType: 'percentage',
                    amort: null,
                    amortType: 'percentage',
                    fixedAmount: null,
                    recurrency: 'monthly'
                })
            },
            deletePayment(paymentIndex) {
                this.loan.payments.splice(paymentIndex, 1)
            },
            resetLoan() {
                this.editLoanIndex = null
                this.loan.id = null
                this.loan.label = null
                this.loan.amount = null
                this.loan.payments = []
                this.loan.data = null

                this.addPayment()
            },
            showPayments(index) {
                $('#transactions_modal').modal('show')
                this.loanData = Object.assign({
                    index: index
                }, this.loans[index])
                this.transactions = this.loans[index].transactions
            }
        }
    }
</script>