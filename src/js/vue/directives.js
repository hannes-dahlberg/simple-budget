//Use to initiate bootstrap tooltip on element
Vue.directive('tooltip', (el, binding) => {
    $(el).tooltip(binding.value)
})

Vue.directive('focus', (el, binding) => {
    if (binding.value) {
        el.focus()
    }
})