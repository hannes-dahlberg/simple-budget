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
    getters: Object.assign({
        getIncomes: state => {
            return state.incomes
        },
        getIncomeRecurrencies: state => {
            return state.recurrencies
        }
    }, storageInterface.getters('income', 'incomes'))
}