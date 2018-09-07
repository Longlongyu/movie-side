<template lang="pug">
  header.header
    router-link(:to="{name: 'post'}")
      .header_menu 主页
    router-link(:to="{name: 'post'}")
      .header_menu 电影
</template>

<script>
export default {
}
</script>

<style lang="sass" scoped>
.header
  width: 100%
  height: 60px
  position: fixed
  left: 0
  right: 0
  color: #000
  background: #a5a5a5
  border-bottom: 2px solid #000
.header_menu
  padding-left: 60px
  padding-top: 20px
  float: left
  color: #fff
</style>
