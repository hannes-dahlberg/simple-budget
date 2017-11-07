<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <form novalidate v-on:submit.prevent="saveExpense">
                    <input type="hidden" v-model="expense.index" />
                    <div class="form-group">
                        <input class="form-control" ref="expense.label" type="text" v-model="expense.label" placeholder="Etikett" />
                    </div>
                    <div class="input-group">
                        <input class="form-control" type="text" v-model="expense.amount" placeholder="Belopp">
                        <span class="input-group-addon" id="basic-addon2">kr</span>
                    </div>
                    <div class="form-group pt-3">
                        <label for="expense.recurrency">Upprepning</label>
                        <selectize id="expense.recurrency" v-model="expense.recurrency" :options="expenseRecurenciesSelectize" :placeholder="$t('expense.recurrencies.none')"></selectize>
                    </div>
                    <div class="form-group">
                        <input class="form-control" ref="expense.start" type="text" v-model="expense.start" :placeholder="expense.recurrency ? 'Från' : 'Period'" />
                    </div>
                    <div v-if="expense.recurrency" class="form-group">
                        <input class="form-control" ref="expense.end" type="text" v-model="expense.end" placeholder="Till" />
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <span v-if="expense.index === null">Lägg till</span>
                        <span v-else>Spara</span>
                    </button>
                    <button v-if="expense.index !== null" class="btn btn-default" v-on:click="resetExpense">Återställ</button>
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
                        <tr v-for="(expense, index) in expenses">
                            <td>{{ expense.label }}</td>
                            <td v-if="view == 'budget'" class="text-right">{{ $store.getters.getFormatedAmount(expense.amount) }}</td>
                            <edit-row v-else="view == 'result'" :index="index" :item-id="expense.id" :amount="expense.amount" :module-name="'expense'"></edit-row>
                            <td>{{ $t('expense.recurrencies.' + (expense.recurrency || 'none')) }}</td>
                            <td v-html="expense.start || '-'" :class="expense.start ? 'text-right' : 'text-center'"></td>
                            <td v-html="expense.end || '-'" :class="expense.end ? 'text-right' : 'text-center'"></td>
                            <td class="text-center">
                                <a class="text-success" href="" v-on:click.prevent="editExpense(index)"><i class="fa fa-pencil" aria-hidden="true"></i></a>
                                <a class="text-danger" href="" v-on:click.prevent="deleteExpense(index)"><i class="fa fa-times" aria-hidden="true"></i></a>
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
                editExpenseIndex: null,
                expense: {
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
            expenses() {
                return this.$store.getters.getExpenses
            },
            expenseRecurencies() {
                return this.$store.getters.getExpenseRecurrencies
            },
            expenseRecurenciesSelectize() {
                return this.expenseRecurencies.map(item => { return { value: item, text: this.$t('expense.recurrencies.' + item) } })
            },
            view() {
                return this.$store.getters.getView
            }
        },
        validators: {

        },
        methods: {
            saveExpense() {
                if(this.editExpenseIndex !== null) {
                    this.$store.commit('updateExpense', {
                        index: this.editExpenseIndex,
                        data: this.expense
                    });
                } else {
                    this.$store.commit('addExpense', this.expense)
                }
                this.resetExpense()
            },
            editExpense(index) {
                if(this.expenses[index]) {
                    this.editExpenseIndex = index
                    Object.keys(this.expenses[index]).forEach(key => {
                        this.expense[key] = this.expenses[index][key]
                    });
                }
            },
            deleteExpense(index) {
                this.$store.commit('deleteExpense', { index });
                if(this.editExpenseIndex == index) {
                    this.resetExpense();
                }
            },
            resetExpense() {
                this.editExpenseIndex = null
                this.expense.id = null
                this.expense.label = null
                this.expense.amount = null
                this.expense.recurrency = null
                this.expense.start = null
                this.expense.end = null
            }
        }
    }
</script>