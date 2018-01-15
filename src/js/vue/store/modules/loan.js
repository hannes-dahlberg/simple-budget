import firstBy from 'thenby'
import storageInterface from './storageInterface'
var mutations = storageInterface.mutations('loan', 'loans')

var round = (value, decimals) => {
    if(!decimals) { decimals = 0 }
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}
var calculateLoanPayments = (amount, interest, amort, fixedAmount, startPeriod, paymentsPerYear, fixedPayments) => {
    var transactions = [];

    var period = startPeriod
    var counter = 0
    while(amount > 1000 && counter < 10000) {

        var transaction = {}
        transaction.period = period
        transaction.interest = interest ? round(interest.type == 'percentage' ? amount * (interest.value / 100) / paymentsPerYear : interest.value, 2) : 0
        transaction.amort = amort ? round(amort.type == 'percentage' ? amount * (amort.value / 100) / paymentsPerYear : amort.value, 2) : 0
        if(fixedAmount && transaction.interest) {
            transaction.amort = fixedAmount - transaction.interest
        } else if(fixedAmount) {
            transaction.interest = fixedAmount - transaction.amort
        }

        if(fixedPayments && fixedPayments[period]) {
            if(fixedPayments[period].interest) {
                transaction.interest = parseFloat(fixedPayments[period].interest.amount)
            }
            if(fixedPayments[period].amort) {
                transaction.amort = parseFloat(fixedPayments[period].amort.amount)
            }
        }
        transaction.amount = round(amount = amount - transaction.amort, 2)

        var year = Math.floor(period / 100)
        var month = Math.round(((period / 100) - year) * 100)
        var addMonths = 12 / paymentsPerYear
        if(month + addMonths > 12) {
            year++
            month = 1
        } else {
            month += addMonths
        }
        period = year + (month < 10 ? '0' : '') + month
        transactions.push(transaction)

        counter++
    }

    return transactions
}

export default {
    state: {
        incrementer: 0,
        loans: [],
        interestResult: {},
        amortResult: {},
        paymentRecurrencies: ['monthly', 'quarterly', 'yearly'],
        paymentTypes: ['fixed_with_interest', 'fixed_with_amort', 'variable']
    },
    mutations: {
        addLoan(state, payload) {
            var periodsPerYear = {
                'monthly': 12,
                'quarterly': 4,
                'yearly': 1
            }
            payload.payments.sort(firstBy((v1, v2) => v1.start > v2.start ))

            payload.payments = payload.payments.map(payment => {
                var amount = payload.amount

                payment.transactions = calculateLoanPayments(
                    amount,
                    ['fixed_with_amort', 'variable'].indexOf(payment.type) != 0 ? { type: payment.interestType, value: payment.interest} : null,
                    ['fixed_with_interest', 'variable'].indexOf(payment.type) != 0 ? { type: payment.amortType, value: payment.amort} : null,
                    payment.type != 'variable' ? payment.fixedAmount : null,
                    payment.start,
                    periodsPerYear[payment.recurrency],
                    payload.fixedPayments
                )
                if(payment.transactions.length) {
                    amount = payment.transactions[payment.transactions.length-1].amount
                }

                return payment
            })

            payload.transactions = []
            payload.payments.forEach(payment => {
                payload.transactions = payload.transactions.concat(payment.transactions);
            })

            mutations.addLoan(state, payload)
        },
        updateLoan(state, payload) {
            var periodsPerYear = {
                'monthly': 12,
                'quarterly': 4,
                'yearly': 1
            }

            payload.data.payments.sort(firstBy((v1, v2) => v1.start > v2.start ))

            payload.data.payments = payload.data.payments.map(payment => {
                var amount = payload.data.amount

                payment.transactions = calculateLoanPayments(
                    amount,
                    ['fixed_with_amort', 'variable'].indexOf(payment.type) != 0 ? { type: payment.interestType, value: payment.interest} : null,
                    ['fixed_with_interest', 'variable'].indexOf(payment.type) != 0 ? { type: payment.amortType, value: payment.amort} : null,
                    payment.type != 'variable' ? payment.fixedAmount : null,
                    payment.start,
                    periodsPerYear[payment.recurrency],
                    payload.fixedPayments
                )

                if(payment.transactions.length) {
                    amount = payment.transactions[payment.transactions.length-1].amount
                }

                return payment
            })

            payload.data.transactions = []
            payload.data.payments.forEach(payment => {
                payload.data.transactions = payload.data.transactions.concat(payment.transactions);
            })

            mutations.updateLoan(state, payload)
        },
        deleteLoan: mutations.deleteLoan,
        setLoanAmortResult(state, payload) {
            if(payload.amount) { //Add if amount is set
                if(_.isUndefined(state.amortResult[payload.period])) { state.amortResult[payload.period] = {}; }

                state.amortResult[payload.period][payload.id] = { amount: payload.amount, comment: payload.comment }
            } else { //Remove if amount is not set
                if(_.isUndefined(state.amortResult[payload.period])) { return; }
                delete state.amortResult[payload.period][payload.id]
                if(Object.keys(state.amortResult[payload.period]).length == 0) {
                    delete state.amortResult[payload.period]
                }
            }
        },
        setLoanInterestResult(state, payload) {
            if(payload.amount) { //Add if amount is set
                if(_.isUndefined(state.interestResult[payload.period])) { state.interestResult[payload.period] = {}; }

                state.interestResult[payload.period][payload.id] = { amount: payload.amount, comment: payload.comment }
            } else { //Remove if amount is not set
                if(_.isUndefined(state.interestResult[payload.period])) { return; }
                delete state.interestResult[payload.period][payload.id]
                if(Object.keys(state.interestResult[payload.period]).length == 0) {
                    delete state.interestResult[payload.period]
                }
            }
        }
    },
    actions: {

    },
    getters: {
        getLoans: state => {
            return state.loans
        },
        getLoanPaymentRecurrencies: state => {
            return state.paymentRecurrencies
        },
        getLoanPaymentTypes: state => {
            return state.paymentTypes
        },
        getLoanInterestResult: state => (id, period) => {
            return _.get(state.interestResult, period + '.' + id, null)
        },
        getLoanAmortResult: state => (id, period) => {
            return _.get(state.amortResult, period + '.' + id, null)
        },
        getOneLoanResult: state => (id) => {
            var returnValue = {}
            Object.keys(state.interestResult).forEach(period => {
                if(state.interestResult[period][id]) {
                    if(!returnValue[period]) { returnValue[period] = {}; }
                    returnValue[period].interest = state.interestResult[period][id]
                }
            })

            Object.keys(state.amortResult).forEach(period => {
                if(state.amortResult[period][id]) {
                    if(!returnValue[period]) { returnValue[period] = {}; }
                    returnValue[period].amort = state.amortResult[period][id]
                }
            })

            return returnValue
        }
    }
}