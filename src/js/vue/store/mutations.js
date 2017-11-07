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
    }
}