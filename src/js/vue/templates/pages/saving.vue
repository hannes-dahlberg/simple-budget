<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <form novalidate v-on:submit.prevent="saveSaving">
                    <div class="form-group">
                        <input class="form-control" ref="saving.label" type="text" v-model="saving.label" placeholder="Etikett" />
                    </div>
                    <div class="input-group">
                        <input class="form-control" type="text" v-model="saving.amount" placeholder="Belopp">
                        <span class="input-group-addon" id="basic-addon2">kr</span>
                    </div>
                    <div class="form-group pt-3">
                        <label for="saving.recurrency">Upprepning</label>
                        <selectize id="saving.recurrency" v-model="saving.recurrency" :options="savingRecurenciesSelectize" :placeholder="$t('saving.recurrencies.none')"></selectize>
                    </div>
                    <div class="form-group">
                        <input class="form-control" ref="saving.start" type="text" v-model="saving.start" :placeholder="saving.recurrency ? 'Från' : 'Period'" />
                    </div>
                    <div v-if="saving.recurrency" class="form-group">
                        <input class="form-control" ref="saving.end" type="text" v-model="saving.end" placeholder="Till" />
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <span v-if="editSavingIndex === null">Lägg till</span>
                        <span v-else>Spara</span>
                    </button>
                    <button v-if="editSavingIndex !== null" class="btn btn-default" v-on:click="resetSaving">Återställ</button>
                </form>
            </div>
            <div class="col-9">
                <transactions-modal id="transactions_modal" :transactions="transactions" :model-id="modelId" module-name="saving" :callback="callback"></transactions-modal>
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Etikett</th>
                            <th>Belopp</th>
                            <th>Saldo ({{ selectedPeriod }})</th>
                            <th>Upprepning</th>
                            <th>Börjar</th>
                            <th>Slutar</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(saving, index) in savings">
                            <td>{{ saving.label }}</td>
                            <td v-if="view == 'budget'" class="text-right">{{ $store.getters.getFormatedAmount(saving.amount) }}</td>
                            <edit-row v-else="view == 'result'" :index="index" :item-id="saving.id" :amount="saving.amount" :module-name="'saving'" :callback="callback"></edit-row>
                            <td>{{ $store.getters.getFormatedAmount($store.getters.getSavingSum(saving.id)) }}</td>
                            <td>{{ $t('saving.recurrencies.' + (saving.recurrency || 'none')) }}</td>
                            <td v-html="saving.start || '-'" :class="saving.start ? 'text-right' : 'text-center'"></td>
                            <td v-html="saving.end || '-'" :class="saving.end ? 'text-right' : 'text-center'"></td>
                            <td class="text-center">
                                <a class="text-success" href="" v-on:click.prevent="editSaving(index)"><i class="fa fa-pencil" aria-hidden="true"></i></a>
                                <a class="text-danger" href="" v-on:click.prevent="deleteSaving(index)"><i class="fa fa-times" aria-hidden="true"></i></a>
                                <a v-if="getTransactions(saving.id).length" class="text-info" href="" v-on:click.prevent="showTransactions(index)"><i class="fa fa-list-ul" aria-hidden="true"></i></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
    import selectize from '../components/selectize'
    import editRow from '../components/edit_row'
    import transactionsModal from '../components/transactions'
    export default {
        components: { selectize, editRow, transactionsModal },
        data() {
            return {
                editSavingIndex: null,
                saving: {
                    id: null,
                    label: null,
                    amount: null,
                    recurrency: null,
                    start: null,
                    end: null
                },
                transactions: null,
                modelId: null
            }
        },
        computed: {
            savings() {
                return this.$store.getters.getSavings
            },
            savingRecurencies() {
                return this.$store.getters.getSavingRecurrencies
            },
            savingRecurenciesSelectize() {
                return this.savingRecurencies.map(item => { return { value: item, text: this.$t('saving.recurrencies.' + item) } })
            },
            selectedPeriod() {
                return this.$store.getters.getSelectedPeriod
            },
            view() {
                return this.$store.getters.getView
            }
        },
        mounted() {

        },
        validators: {

        },
        methods: {
            saveSaving() {
                if(this.editSavingIndex !== null) {
                    this.$store.commit('updateSaving', {
                        index: this.editSavingIndex,
                        data: this.saving
                    });
                } else {
                    this.$store.commit('addSaving', this.saving)
                }
                this.resetSaving();
            },
            editSaving(index) {
                if(this.savings[index]) {
                    this.editSavingIndex = index
                    Object.keys(this.savings[index]).forEach(key => {
                        this.saving[key] = this.savings[index][key]
                    });
                }
            },
            deleteSaving(index) {
                swal('Ta bort', 'Är du säker', 'warning', {buttons: ['Nej', 'Ja']}).then(value => {
                    if(value) {
                        this.$store.commit('deleteSaving', { index });
                        if(this.editSavingIndex == index) {
                            this.resetSaving();
                        }
                    }
                })
            },
            resetSaving() {
                this.editSavingIndex = null
                this.saving.id = null
                this.saving.label = null
                this.saving.amount = null
                this.saving.recurrency = null
                this.saving.start = null
                this.saving.end = null
            },
            getTransactions(id) {
                return this.$store.getters.getSavingTransactions(id)
            },
            showTransactions(index) {
                $('#transactions_modal').modal('show')
                this.modelId = this.savings[index].id
                this.transactions = this.getTransactions(this.savings[index].id)
            },
            callback() {
                this.$forceUpdate()
            }
        }
    }
</script>