<template>
    <div class="container">
        <div class="card">
            <div class="card-body">
                <div class="row justify-content-end">
                    <div class="col-2 pr-1">
                        <selectize v-model="selectedLength" :options="filterToSelectize" :allowNone="false" v-on:change="setFilterTo"></selectize>
                    </div>
                    <div class="col-3 pl-0">
                        <div class="input-group">
                            <span class="input-group-btn">
                                <button class="btn btn-secondary" type="button" v-on:click="$store.commit('setFilterPrevPeriod')">Prev</button>
                            </span>
                            <input type="text" class="form-control text-center" :value="filterFrom" disabled>
                            <span class="input-group-btn">
                                <button class="btn btn-secondary" type="button" v-on:click="$store.commit('setFilterNextPeriod')">Next</button>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <table class="table table-striped table-bordered header-fixed table-sm">
                            <thead>
                                <tr>
                                    <th style="width: 16%">Period</th>
                                    <th style="width: 14%">Inkomst</th>
                                    <th style="width: 14%">Utgifter</th>
                                    <th style="width: 14%">Lånekostnader</th>
                                    <th style="width: 14%">Besparingar</th>
                                    <th style="width: 14%">Kvarstående</th>
                                    <th style="width: 14%">Saldo</th>
                                </tr>
                            </thead>
                            <tbody style="height: 500px;">
                                <tr v-for="post in budget">
                                    <td style="width: 16%;" class="text-right">{{ post.period }}</td>
                                    <td style="width: 14%;" class="text-right">{{ $store.getters.getFormatedAmount(post.income) }}</td>
                                    <td style="width: 14%;" class="text-right">{{ $store.getters.getFormatedAmount(post.expense) }}</td>
                                    <td style="width: 14%;" class="text-right">{{ $store.getters.getFormatedAmount(post.loan) }}</td>
                                    <td style="width: 14%;" class="text-right">{{ $store.getters.getFormatedAmount(post.saving) }}</td>
                                    <td style="width: 14%;" class="text-right">{{ $store.getters.getFormatedAmount(post.remaining) }}</td>
                                    <td style="width: 14%;" class="text-right">{{ $store.getters.getFormatedAmount(post.balance) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import selectize from '../components/selectize'
    export default {
        components: { selectize },
        data() {
            return {
                selectedLength: this.$store.getters.getFilterLength
            }
        },
        computed: {
            filterLength() {
                return this.$store.getters.getFilterLength
            },
            filterFrom() {
                return this.$store.getters.getFilterFrom
            },
            filterTo() {
                return this.$store.getters.getFilterTo
            },
            filterToSelectize() {
                return [
                    { value: 12, text: 'Ett år' },
                    { value: 24, text: 'Två år' },
                    { value: 36, text: 'Tre år' },
                    { value: 60, text: 'Fem år' },
                    { value: 120, text: 'Tio år' }
                ]
            },
            budget() {
                var budget = []
                var period = this.filterFrom
                var balance = 0
                while(period <= this.filterTo) {
                    var loan = [{ interest: 0, amort: 0 }]
                    var budgetItem = {
                        period: period,
                        income: this.filteredBudget(period, 'getIncomes', 'getIncomeResult'),
                        expense: this.filteredBudget(period, 'getExpenses', 'getExpenseResult'),
                        loan: Math.round((loan.concat.apply(loan, this.$store.getters.getLoans.map(item => item.transactions.filter(item => item.period == period))).map(item => item.interest + item.amort).reduce((sum, amount) => parseFloat(sum) + parseFloat(amount)) * 100)) / 100,
                        saving: this.filteredBudget(period, 'getSavings', 'getSavingResult')
                    }

                    budgetItem.remaining = Math.round((budgetItem.income - budgetItem.expense - budgetItem.loan - budgetItem.saving) * 100) / 100
                    budgetItem.balance = balance = Math.round((balance + budgetItem.remaining) * 100) / 100
                    budget.push(budgetItem)

                    var year = Math.floor(period / 100)
                    var month = Math.round(((period / 100) - year) * 100)
                    if(month == 12) {
                        year++
                        month = 1
                    } else {
                        month++
                    }
                    period = year + (month < 10 ? '0' : '') + month
                }

                return budget
            }
        },
        methods: {
            setFilterTo() {
                this.$store.commit('setFilterLength', this.selectedLength)
            },
            filteredBudget(period, getterName, getterResultName) {
                return [].concat.apply([0], this.$store.getters[getterName].filter(item => {
                    if((period >= item.start || !item.start) && (period <= item.end || !item.end)) {
                        var month = parseInt(period.toString().substr(4,2))
                        if(item.recurrency == 'quarterly' && [1, 4, 7, 10].indexOf(month) == -1) {
                            return false
                        } else if(item.recurrency == 'yearly' && [1].indexOf(month) == -1) {
                            return false
                        }
                        return true
                    }

                    return false
                }
                ).map((item, index) => {
                    var getValue = this.$store.getters[getterResultName](item.id, period)
                    return getValue ? getValue.amount : item.amount
                })).reduce((sum, amount) => parseFloat(sum) + parseFloat(amount))
            }
        }
    }
</script>