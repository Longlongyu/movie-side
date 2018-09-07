<template lang="pug">
  section.movieList
    div
      router-link(class="good-list-link" :to="{name: 'post'}") 狄仁杰之四大天王
</template>

<script>
export default {
}
</script>

<style lang="sass" scoped>
section.movieList
  padding: 5px
  border-bottom: 1px dashed #ababab
</style>
