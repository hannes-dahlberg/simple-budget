<template>
    <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Transaktioner</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" v-if="loadedTransations">
                    <table class="table table-striped table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Ränta</th>
                                <th>Amortering</th>
                                <th>Belopp</th>
                                <th>Skuld</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(transaction, index) in pagination(loadedTransations)">
                                <td>{{ transaction.period }}</td>
                                <edit-row :index="index" :amount="transaction.interest" :item-id="loanData.id" :module-name="'loanInterest'" :period="transaction.period" :callback="callback"></edit-row>
                                <edit-row :index="index" :amount="transaction.amort" :item-id="loanData.id" :module-name="'loanAmort'" :period="transaction.period" :callback="callback"></edit-row>
                                <td>{{ $store.getters.getFormatedAmount(Math.round((transaction.interest + transaction.amort) * 100) / 100) }}</td>
                                <td>{{ $store.getters.getFormatedAmount(transaction.amount) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="text-center">
                        <button class="btn btn-primary" :disabled="page == 1" v-on:click.prevent="prevPage">Prev</button>
                        <span v-html="this.page + '/' + this.pages"></span>
                        <button class="btn btn-primary" :disabled="page == pages" v-on:click.prevent="nextPage">Next</button>
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Stäng</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import editRow from '../../../components/edit_row'
    export default {
        props: ['id', 'transactions', 'loanData'],
        components: { editRow },
        data() {
            return {
                loadedTransations: null,
                page: 1,
                transactionsPerPage: 12
            }
        },
        computed: {
            loans() {
                return this.$store.getters.getLoans
            },
            view() {
                return this.$store.getters.getView
            },
            pages() {
                return Math.ceil(this.loadedTransations.length / this.transactionsPerPage)
            }
        },
        watch: {
            'transactions'() {
                this.loadedTransations = this.transactions
                this.page = 1
            }
        },
        methods: {
            nextPage() {
                if(this.page < this.pages) {
                    this.page++
                }
            },
            prevPage() {
                if(this.page > 1) {
                    this.page--
                }
            },
            pagination() {
                var start = this.page * this.transactionsPerPage - this.transactionsPerPage
                var end = start + this.transactionsPerPage
                return this.loadedTransations.slice(start, end)
            },
            callback() {
                this.$store.commit('updateLoan', {
                    index: this.loanData.index,
                    data: this.loanData,
                    fixedPayments: this.$store.getters.getOneLoanResult(this.loanData.id)
                });

                this.loadedTransations = this.loans[this.loanData.index].transactions
            }
        }
    }
</script>