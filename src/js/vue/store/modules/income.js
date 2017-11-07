import storageInterface from './storageInterface'
export default {
    state: {
        incrementer: 0,
        incomes: [],
        result: {},
        recurrencies: ['monthly', 'quarterly', 'yearly']
    },
    mutations: storageInterface.mutations('income', 'incomes'),
    actions: {

    },
    getters: {
        getIncomes: state => {
            return state.incomes
        },
        getIncomeRecurrencies: state => {
            return state.recurrencies
        },
        getIncomeResult: (state, getters) => (id, period) => {
            return _.get(state.result, (period || getters.getSelectedPeriod) + '.' + id, null)
        }
    }
}