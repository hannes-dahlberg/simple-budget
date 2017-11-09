import storageInterface from './storageInterface'
export default {
    state: {
        incrementer: 0,
        expenses: [],
        result: {},
        recurrencies: ['monthly', 'quarterly', 'yearly']
    },
    mutations: storageInterface.mutations('expense', 'expenses'),
    actions: {

    },
    getters: Object.assign({
        getExpenses: state => {
            return state.expenses
        },
        getExpenseRecurrencies: state => {
            return state.recurrencies
        }
    }, storageInterface.getters('expense', 'expenses'))
}