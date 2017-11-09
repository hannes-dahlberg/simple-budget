<template>
    <div>
        <a name="top"></a>
        <navbar></navbar>
        <view-toggle></view-toggle>
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
            mounted() {
                console.log(this)
            }
        }
</script>