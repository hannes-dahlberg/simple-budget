import storageInterface from './storageInterface'

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

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
    getters: Object.assign({
        getSavings: state => {
            return state.savings
        },
        getSavingRecurrencies: state => {
            return state.recurrencies
        },
        getSavingSum: (state, getters) => (id) => {
            var filterSavings = getters.getSavings.filter(saving => saving.start <= getters.getSelectedPeriod)
            var saving = getters.getSavings.find(saving => saving.id == id)
            if(!saving) { return 0; }

            var sum = 0
            var period = saving.start
            var endPeriod = (saving.end && saving.end < getters.getSelectedPeriod) ? saving.end : getters.getSelectedPeriod
            while(period <= endPeriod) {
                var year = Math.floor(period / 100)
                var month = Math.round(((period / 100) - year) * 100)

                var result = getters.getSavingResult(saving.id, period) || 0
                var savingAmount = getters.getSavings.find(saving => saving.id == id) || 0

                sum += parseFloat(result.amount) || parseFloat(savingAmount.amount) || 0
                if(month == 12) {
                    year++
                    month = 1
                } else {
                    month++
                }


                period = year + (month < 10 ? '0' : '') + month
            }
            return sum;
        }
    }, storageInterface.getters('saving', 'savings'))
}