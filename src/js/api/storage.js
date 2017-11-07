export default {
    backup(key, name, data) {
        return axios.post('/api/backup?key=' + key, { name, data: JSON.stringify(data) })
    },
    restore(key, name) {
        return new Promise((resolve, reject) => {
            return axios.get('/api/restore?key=' + key + '&name=' + name).then(result => resolve(result.data)).catch(error => reject(error))
        })
    }
}