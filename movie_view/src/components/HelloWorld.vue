<template lang="pug">
  .hello
    h1 {{ msg }}
    h2 Essential Links
    router-link(:to="{name: 'post', params: {id: 123}}") Post
    router-link(:to="{name: 'user', params: {id: 123}}") User
    router-link(:to="{name: 'userprops', params: {id: 123}}") UserProps
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
