import storageInterface from './storageInterface'
export default {
    state: {
        incrementer: 0,
        savings: [],
        result: {},
        recurrencies: ['monthly', 'quarterly', 'yearly']
    },
    mutations: storageInterface.mutations('saving', 'savings'),
    actions: {

    },
    getters: {
        getSavings: state => {
            return state.savings
        },
        getSavingRecurrencies: state => {
            return state.recurrencies
        },
        getSavingResult: (state, getters) => (index, period) => {
            return _.get(state.result, (period || getters.getSelectedPeriod) + '.' + index, null)
        },
        getCalculatedSaving: (state, getters) => (period) => {
            return getters.getSavings
        }
    }
}