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
    getters: {
        getExpenses: state => {
            return state.expenses
        },
        getExpenseRecurrencies: state => {
            return state.recurrencies
        },
        getExpenseResult: (state, getters) => (id, period) => {
            return _.get(state.result, (period || getters.getSelectedPeriod) + '.' + id, null)
        }
    }
}