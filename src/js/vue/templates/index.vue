<template>
    <div>
        <a name="top"></a>
        <navbar></navbar>
        <view-toggle v-if="['page.income', 'page.saving', 'page.expense'].indexOf(routeName) != -1"></view-toggle>
        <router-view></router-view>
        <footer-component></footer-component>
    </div>
</template>
<script>
        import navbar from './components/navbar'
        import footerComponent from './components/footer'
        import viewToggle from './components/view_toggle'

        export default {
            components: { navbar, footerComponent, viewToggle },
            computed: {
                routeName() {
                    return this.$route.name
                }
            },
            mounted() {
                console.log(this)
            }
        }
</script>