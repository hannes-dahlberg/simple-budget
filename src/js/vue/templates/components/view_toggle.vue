<template>
    <div class="container">
        <div class="row mb-3">
            <div class="col-12">
                <form v-on:submit.prevent="" class="form-inline justify-content-end">
                    <label v-html="$t('view.period')"></label>
                    <input type="text" class="form-control mx-3" :value="selectedPeriod" v-model="form.selectedPeriod" :disabled="view == 'budget'">
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">
                            <input class="form-check-input" type="radio" name="showBudget" value="budget" v-model="form.view">
                            <span v-html="$t('view.budget')"></span>
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">
                            <input class="form-check-input" type="radio" name="showBudget" value="result" v-model="form.view">
                            <span v-html="$t('view.result')"></span>
                        </label>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    selectedPeriod: null,
                    view: null
                }
            }
        },
        computed: {
            selectedPeriod() {
                return this.$store.getters.getSelectedPeriod
            },
            view() {
                return this.$store.getters.getView
            }
        },
        watch: {
            'form.selectedPeriod'() {
                this.$store.commit('setSeletctedPeriod', this.form.selectedPeriod)
            },
            'form.view'() {
                this.$store.commit('toggleView', this.form.view)
            }
        },
        mounted() {
            this.form.selectedPeriod = this.selectedPeriod
            this.form.view = this.view
        }
    }
</script>