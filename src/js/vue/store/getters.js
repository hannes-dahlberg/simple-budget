export default {
    getKey: (state) => {
        return state.key
    },
    getStorageName: (state) => {
        return state.storageName
    },
    getMenu: (state) => {
        return state.menu
    },
    getView: (state) => {
        return state.view
    },
    getSelectedPeriod: (state) => {
        return state.selectedPeriod
    },
    getLanguage: (state) => {
        state.currentLanguage = state.defaultLanguage
        return state.currentLanguage
    },
    readLocalStorage: () => (key) => {
        return JSON.parse(localStorage.getItem(key))
    },
    getFormatedAmount: () => (amount) => {
        var n = amount
        var c = 2
        var d = ','
        var t = ' '
        var s = n < 0 ? '-' : ''
        var i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)))
        var j = (j = i.length) > 3 ? j % 3 : 0
        return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '') + ' kr';
    }
}