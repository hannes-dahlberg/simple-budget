<template>
    <td class="edit-row" v-on:dblclick.prevent="editResult" :class="{ 'input': edit }">
        <input class="d-none" :class="{ 'd-inline-block': edit }" type="text"
            ref="result"
            :value="getResult().amount"
            v-focus="edit"
            @keyup.enter="doneEdit"
            @keyup.esc="edit = false"
            :placeholder="$store.getters.getFormatedAmount(amount)">
        <span v-if="getResult().amount" class="text-info float-right" v-html="$store.getters.getFormatedAmount(getResult().amount)"></span>
        <span v-else-if="!edit" class="text-muted float-right" v-html="$store.getters.getFormatedAmount(amount)"></span>
        <div class="comment d-none" :class="{ 'd-inline-block': edit }">
            <div class="card">
                <div class="card-header py-0 pr-1">
                    Kommentar
                    <a class="float-right text-danger" href="#" v-on:click.prevent="edit = false"><i class="fa fa-times" aria-hidden="true"></i></a>
                </div>
                <div class="card-body p-1">
                    <div class="form-group m-0">
                        <textarea class="form-control" rows="4"
                        ref="comment"
                        :value="getResult().comment"
                        @keyup.enter="doneEdit"
                        @keyup.esc="edit = false"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </td>
</template>
<script>
    export default {
        props: ['index', 'itemId', 'amount', 'moduleName', 'period', 'callback'],
        data() {
            return {
                edit: false,
                fields: {
                    amount: null,
                    comment: null
                }
            }
        },
        computed: {
            selectedPeriod() {
                return this.$store.getters.getSelectedPeriod
            }
        },
        methods: {
            editResult() {
                this.edit = true
            },
            doneEdit() {
                if(!this.edit) { return }

                var name = 'set' + this.moduleName.charAt(0).toUpperCase() + this.moduleName.slice(1) + 'Result';
                this.$store.commit(name, {
                    period: this.period || this.selectedPeriod,
                    id: this.itemId,
                    amount: this.$refs['result'].value,
                    comment: this.$refs['comment'].value
                })

                this.edit = false

                if(_.isFunction(this.callback)) {
                    this.callback(this.index)
                }
            },
            getResult() {
                var name = 'get' + this.moduleName.charAt(0).toUpperCase() + this.moduleName.slice(1) + 'Result';
                return this.$store.getters[name](this.itemId, this.period) || { amount: null, comment: null }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .edit-row {
        position: relative;
    }
    .comment {
        width: 200%;
        position: absolute;
        left: -50%;
        top: 120%;
        z-index: 1;
        textarea {
            resize: none;
        }
    }
</style>