<template>
    <div class="container">
        <div class="row">
            <div class="col-6 mx-auto">
                <div class="card">
                    <h4 class="card-header" v-html="$t('settings.settings')"></h4>
                    <div class="card-body">
                        <div class="form-group">
                            <label v-html="$t('settings.key')"></label>
                            <input class="form-control" type="text" ref="key" :value="key">
                        </div>
                        <div class="form-group">
                            <label v-html="$t('settings.storage_name')"></label>
                            <input class="form-control" type="text" ref="name" :value="storageName">
                        </div>
                        <button type="button" class="btn btn-primary btn-block btn-lg" v-on:click.prevent="backup">
                            <i v-if="backupLoading" class="fa fa-spinner fa-pulse"></i>
                            <span v-else v-html="$t('settings.backup')"></span>
                        </button>
                        <button type="button" class="btn btn-danger btn-block btn-lg" v-on:click.prevent="restore">
                            <i v-if="restoreLoading" class="fa fa-spinner fa-pulse"></i>
                            <span v-else v-html="$t('settings.restore')"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import viewToggle from '../components/view_toggle'
    export default {
        components: { viewToggle },
        data() {
            return {
                backupLoading: false,
                restoreLoading: false
            }
        },
        computed: {
            key() {
                return this.$store.getters.getKey
            },
            storageName() {
                return this.$store.getters.getStorageName
            }
        },
        methods: {
            backup() {
                this.backupLoading = true
                this.$store.commit('setKey', this.$refs['key'].value)
                this.$store.commit('setStorageName', this.$refs['name'].value)
                this.$store.dispatch('backup').then(() => {
                    swal('Säkerhetskopierad', 'Data har blivit säkerhetskopierad', 'success')
                    this.backupLoading = false
                }).catch(error => {
                    swal('Oj då', 'Något gick fel!', 'error')
                    this.backupLoading = false
                })
            },
            restore() {
                this.restoreLoading = true
                this.$store.commit('setKey', this.$refs['key'].value)
                this.$store.commit('setStorageName', this.$refs['name'].value)
                this.$store.dispatch('restore').then(() => {
                    swal('Återställd', 'Data har blivit återställd', 'success').then(() => {
                        location.reload()
                    })
                    this.restoreLoading = false
                }).catch(error => {
                    swal('Oj då', 'Något gick fel!', 'error')
                    this.restoreLoading = false
                })
            }
        }
    }
</script>