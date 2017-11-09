export default {
    mutations(unitName, storageName) {
        unitName = unitName.charAt(0).toUpperCase() + unitName.slice(1)
        return {
            ['add' + unitName](state, payload) {
                payload.id = ++state.incrementer
                if(!payload.recurrency) { payload.end = payload.start}
                state[storageName].push(Object.assign({}, payload));
            },
            ['update'+ unitName](state, payload) {
                var foundIndex = state[storageName].findIndex(item => item.id == payload.data.id)
                if(foundIndex != -1) {
                    if(!payload.data.recurrency) { payload.data.end = payload.data.start}
                    state[storageName].splice(foundIndex, 1, Object.assign({}, payload.data))
                }
            },
            ['delete' + unitName](state, payload) {
                var name = payload.unitName || 'result'
                if(!_.isArray(name)) { name = [name] }

                for(var a = 0; a < name.length; a++) {
                    Object.keys(state[name[a]]).forEach(period => {
                        if(state[name[a]][period][state[storageName][payload.index].id]) {
                            delete state[name[a]][period][state[storageName][payload.index].id]
                        }
                    })
                }
                state[storageName].splice(payload.index, 1)
            },
            ['set' + unitName + 'Result'](state, payload) {
                if(payload.amount) { //Add if amount is set
                    if(_.isUndefined(state.result[payload.period])) { state.result[payload.period] = {}; }

                    state.result[payload.period][payload.id] = { amount: payload.amount, comment: payload.comment }
                } else { //Remove if amount is not set
                    if(_.isUndefined(state.result[payload.period])) { return; }
                    delete state.result[payload.period][payload.id]
                    if(Object.keys(state.result[payload.period]).length == 0) {
                        delete state.result[payload.period]
                    }
                }
            }
        }
    },
    getters(unitName, storageName) {
        unitName = unitName.charAt(0).toUpperCase() + unitName.slice(1)
        return {
            ['get' + unitName + 'Result']: (state, getters) => (id, period) => {
                return _.get(state.result, (period || getters.getSelectedPeriod) + '.' + id, null)
            },
            ['get' + unitName + 'Transactions']: (state, getters) => (id) => {
                var transactions = []
                Object.keys(state.result).forEach(period => {
                    var result = state.result[period][id]
                    if(result) {
                        transactions.push({ period: period, amount: result.amount, comment: result.comment })
                    }
                })

                return transactions
            }
        }
    }
}