<template lang="pug">
  section.loginPage
    router-link(to="/loginPage")
      .header_menu 登录
</template>

<script>
export default {
}
</script>

<style lang="sass" scoped>
section.loginPage
  width: 103%
  height: 30px
  left: 0
  top: 0
  color: #000
  background-color: #C3BD5C
.header_menu
  padding-left: 60px
  padding-top: 10px
  float: left
  color: #fff
  font-size: 8px
</style>
