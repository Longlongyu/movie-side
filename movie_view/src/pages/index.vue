<template lang="pug">
  .container
    movie-index-header
    .userMessage
      user-message
    .contentPic
      index-header-pic
    .contentMain
      div
        .contentLeft
          ul.cont-ul
            movies-list
      div
        .contentRight
          ul.cont-ul
            news-list
    common-footer
</template>

<script>
import MovieIndexHeader from '../components/MovieIndexHeader'
import CommonFooter from '../components/CommonFooter'
import NewsList from '../components/NewsList'
import MoviesList from '../components/MoviesList'
import IndexHeaderPic from '../components/IndexHeaderPic'
import UserMessage from '../components/UserMessage'
export default {
  data () {
    return {}
  },
  components: {
    MovieIndexHeader,
    CommonFooter,
    NewsList,
    MoviesList,
    IndexHeaderPic,
    UserMessage
  },
  created () {}
}
</script>

<style lang="sass" scoped>
.container
  width: 100%
  margin: 0 auto
.contentMain
  height: 50px
.userMessage
  padding-top: 60px
  margin-top: -10px
  margin-left: -10px
.contentLeft
  width: 60%
  float: left
  margin-top: 5px
  border-top: 1px solid #000
.contentRight
  width: 38%
  margin-left: 1%
  float: left
  margin-top: 5px
  border-top: 1px solid #000
.cont-ul
  padding-top: 0.5rem
  background-color: #fff
  ::after
    content: ''
    display: block
    clear: both
    width: 0
    height: 0
</style>
