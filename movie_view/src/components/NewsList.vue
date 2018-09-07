<template lang="pug">
  section.goods-list
    .newsList
      router-link.goods-list-link(:to="{name: 'post'}") 新文章
</template>

<script>
export default {
}
</script>

<style lang="sass" scoped>
section.newsList
  padding: 5px
  font-size: 10px
  border-bottom: 1px dashed #ababab
</style>
