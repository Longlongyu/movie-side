<template lang="pug">
  section
    div 用户界面,Hello {{ $route.params.id }}
    h1 {{msg}}
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
