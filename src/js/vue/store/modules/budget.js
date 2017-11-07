export default {
    state: {
        filterLength: 12,
        filterFrom: 201701
    },
    mutations: {
        setFilterLength(state, length) {
            state.filterLength = length
        },
        setFilterNextPeriod(state) {
            var year = Math.floor(state.filterFrom / 100)
            var month = Math.round(((state.filterFrom / 100) - year) * 100)

            if(month == 12) {
                year++;
                month = 1
            } else {
                month++
            }

            state.filterFrom = year + (month < 10 ? '0' : '') + month
        },
        setFilterPrevPeriod(state) {
            var year = Math.floor(state.filterFrom / 100)
            var month = Math.round(((state.filterFrom / 100) - year) * 100)

            if(month == 1) {
                year--;
                month = 12
            } else {
                month--
            }

            state.filterFrom = year + (month < 10 ? '0' : '') + month
        }
    },
    getters: {
        getFilterLength: state => {
            return state.filterLength
        },
        getFilterFrom: state => {
            return state.filterFrom
        },
        getFilterTo: state => {
            var year = Math.floor(state.filterFrom / 100)
            var month = Math.round(((state.filterFrom / 100) - year) * 100)

            year += Math.floor(state.filterLength / 12)
            month += state.filterLength % 12

            if(month > 12) {
                year++
                month -= 12
            }

            return year + (month < 10 ? '0' : '') + month
        }
    }
}