export default {
    setKey(state, key) {
        state.key = key
    },
    setStorageName(state, name) {
        state.storageName = name
    },
    setLanguage(state, lang) {
        state.currentLanguage = lang
    },
    toggleView(state, view) {
        state.view = view
    },
    setSeletctedPeriod(state, period) {
        state.selectedPeriod = period
    },
    setSelectedPeriodNext(state) {
        var year = Math.floor(state.selectedPeriod / 100)
        var month = Math.round(((state.selectedPeriod / 100) - year) * 100)

        if(month == 12) {
            year++;
            month = 1
        } else {
            month++
        }

        state.selectedPeriod = year + (month < 10 ? '0' : '') + month
    },
    setSelectedPeriodPrev(state) {
        var year = Math.floor(state.selectedPeriod / 100)
        var month = Math.round(((state.selectedPeriod / 100) - year) * 100)

        if(month == 1) {
            year--;
            month = 12
        } else {
            month--
        }

        state.selectedPeriod = year + (month < 10 ? '0' : '') + month
    }
}