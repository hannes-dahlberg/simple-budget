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
                                <th style="width: 20%">Period</th>
                                <th style="width: 20%">Belopp</th>
                                <th style="width: 50%">Kommentar</th>
                                <th style="width: 10%;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(transaction, index) in pagination(loadedTransations)">
                                <td>{{ transaction.period }}</td>
                                <edit-row :index="index" :amount="transaction.amount" :item-id="modelId" :module-name="moduleName" :period="transaction.period" :callback="rowCallback"></edit-row>
                                <td>{{ transaction.comment }}</td>
                                <td class="text-center">
                                    <a class="text-danger" href="" v-on:click.prevent="deleteTransaction(transaction.period)"><i class="fa fa-times" aria-hidden="true"></i></a>
                                </td>
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
    import editRow from './edit_row'
    export default {
        props: ['id', 'transactions', 'modelId', 'moduleName', 'callback'],
        components: { editRow },
        data() {
            return {
                loadedTransations: null,
                page: 1,
                transactionsPerPage: 20
            }
        },
        computed: {
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
            deleteTransaction(period) {
                swal('Ta bort', 'Är du säker', 'warning', {buttons: ['Nej', 'Ja']}).then(value => {
                    if(value) {
                        var name = 'set' + this.moduleName.charAt(0).toUpperCase() + this.moduleName.slice(1) + 'Result';
                        this.$store.commit(name, {
                            period: period,
                            id: this.modelId,
                            amount: null,
                            comment: null
                        })

                        this.rowCallback()
                    }
                })
            },
            rowCallback() {
                var name = 'get' + this.moduleName.charAt(0).toUpperCase() + this.moduleName.slice(1) + 'Transactions';
                this.loadedTransations = this.$store.getters[name](this.modelId)

                //Hide modal if transactionlist is empty
                if(!this.loadedTransations.length) {
                    $('#' + this.id).modal('hide')
                    if(this.callback) {
                        this.callback()
                    }
                }

                //Forcing any value dependent on period to re-render
                var oldSelectedPeriod = this.$store.getters.getSelectedPeriod
                this.$store.commit('setSeletctedPeriod', null)
                this.$store.commit('setSeletctedPeriod', oldSelectedPeriod)
            }
        }
    }
</script>