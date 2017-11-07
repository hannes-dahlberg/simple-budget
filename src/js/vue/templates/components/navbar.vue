<template>
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
            <router-link :to="{ name: 'page.budget' }" class="navbar-brand">
                <img width="173" class="ml-3 ml-md-0" src="/img/logo.png" :alt="$t('main.title')" />
            </router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item px-2 align-self-end align-self-lg-center" v-for="item in menu" :class="{ 'divider': item.divider, 'd-block, d-lg-none': item.mobileOnly, 'd-none d-lg-block': item.desktopOnly }">
                        <a v-if="!item.divider && item.url" class="nav-link" :href="item.url" v-html="$t(item.name)"></a>
                        <router-link v-else-if="!item.divider" class="nav-link" :to="item.route" v-html="$t(item.name)"></router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
    export default {
        computed: {
            menu() {
                return this.$store.getters.getMenu
            }
        }
    }
</script>