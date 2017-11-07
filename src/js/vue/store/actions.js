import storageApi from '../../api/storage'

export default {
    backup({ state }) {
        return storageApi.backup(state.key, state.storageName, JSON.parse(localStorage.getItem('simple-budget')))
    },
    restore({ state }) {
        return new Promise((resolve, reject) => {
            storageApi.restore(state.key, state.storageName).then(data => {
                localStorage.setItem('simple-budget', JSON.stringify(data))
                resolve()
            }).catch(error => { console.log(error); reject(error) })
        })
    },
    writeLocalStorage({}, payload) {
        //Local storage not available in incognito mode (safari). Make sure not to end on error
        try {
            localStorage.setItem(Object.keys(payload)[0], JSON.stringify(payload[Object.keys(payload)[0]]))
        } catch(e) {

        }
    },
    removeLocalStorage({}, key) {
        localStorage.removeItem(key)
    }
}