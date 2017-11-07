<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <form novalidate v-on:submit.prevent="saveIncome">
                    <div class="form-group">
                        <input class="form-control" ref="income.label" type="text" v-model="income.label" placeholder="Etikett" />
                    </div>
                    <div class="input-group">
                        <input class="form-control" type="text" v-model="income.amount" placeholder="Belopp">
                        <span class="input-group-addon" id="basic-addon2">kr</span>
                    </div>
                    <div class="form-group pt-3">
                        <label for="income.recurrency">Upprepning</label>
                        <selectize id="income.recurrency" v-model="income.recurrency" :options="incomeRecurenciesSelectize" :placeholder="$t('income.recurrencies.none')"></selectize>
                    </div>
                    <div class="form-group">
                        <input class="form-control" ref="income.start" type="text" v-model="income.start" :placeholder="income.recurrency ? 'Från' : 'Period'" />
                    </div>
                    <div v-if="income.recurrency" class="form-group">
                        <input class="form-control" ref="income.end" type="text" v-model="income.end" placeholder="Till" />
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <span v-if="editIncomeIndex === null">Lägg till</span>
                        <span v-else>Spara</span>
                    </button>
                    <button v-if="editIncomeIndex !== null" class="btn btn-default" v-on:click="resetIncome">Återställ</button>
                </form>
            </div>
            <div class="col-9">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Etikett</th>
                            <th>Belopp</th>
                            <th>Upprepning</th>
                            <th>Börjar</th>
                            <th>Slutar</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(income, index) in incomes">
                            <td>{{ income.label }}</td>
                            <td v-if="view == 'budget'" class="text-right">{{ $store.getters.getFormatedAmount(income.amount) }}</td>
                            <edit-row v-else="view == 'result'" :index="index" :item-id="income.id" :amount="income.amount" :module-name="'income'"></edit-row>
                            <td>{{ $t('income.recurrencies.' + (income.recurrency || 'none')) }}</td>
                            <td v-html="income.start || '-'" :class="income.start ? 'text-right' : 'text-center'"></td>
                            <td v-html="income.end || '-'" :class="income.end ? 'text-right' : 'text-center'"></td>
                            <td class="text-center">
                                <a class="text-success" href="" v-on:click.prevent="editIncome(index)"><i class="fa fa-pencil" aria-hidden="true"></i></a>
                                <a class="text-danger" href="" v-on:click.prevent="deleteIncome(index)"><i class="fa fa-times" aria-hidden="true"></i></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
    import selectize from '../components/selectize'
    import editRow from '../components/edit_row'
    export default {
        components: { selectize, editRow },
        data() {
            return {
                editIncomeIndex: null,
                income: {
                    id: null,
                    label: null,
                    amount: null,
                    recurrency: null,
                    start: null,
                    end: null
                }
            }
        },
        computed: {
            incomes() {
                return this.$store.getters.getIncomes
            },
            incomeRecurencies() {
                return this.$store.getters.getIncomeRecurrencies
            },
            incomeRecurenciesSelectize() {
                return this.incomeRecurencies.map(item => { return { value: item, text: this.$t('income.recurrencies.' + item) } })
            },
            view() {
                return this.$store.getters.getView
            }
        },
        mounted() {

        },
        validators: {

        },
        methods: {
            saveIncome() {
                if(this.editIncomeIndex !== null) {
                    this.$store.commit('updateIncome', {
                        index: this.editIncomeIndex,
                        data: this.income
                    });
                } else {
                    this.$store.commit('addIncome', this.income)
                }
                this.resetIncome();
            },
            editIncome(index) {
                if(this.incomes[index]) {
                    this.editIncomeIndex = index
                    Object.keys(this.incomes[index]).forEach(key => {
                        this.income[key] = this.incomes[index][key]
                    });
                }
            },
            deleteIncome(index) {
                this.$store.commit('deleteIncome', { index });
                if(this.editIncomeIndex == index) {
                    this.resetIncome();
                }
            },
            resetIncome() {
                this.editIncomeIndex = null
                this.income.id = null
                this.income.label = null
                this.income.amount = null
                this.income.recurrency = null
                this.income.start = null
                this.income.end = null
            }
        }
    }
</script>