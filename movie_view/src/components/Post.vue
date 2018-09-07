<template lang="pug">
  .post
    .loading(v-if="loading") loading...
    .error(v-if="error") {{ error }}
    .content(v-if="post")
      h2 {{ post.title }}
      p {{ post.body }}
      input(type="text" name="username" value="longlongyu")
      input(type="password" name="password" value="123456")
      input(type="submit")
</template>

<script>
export default {
  name: 'post',
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = null
      this.post = {
        title: '登录',
        body: '请输入用户名和密码'
      }
      this.loading = false
      this.$axios({
        method: 'post',
        url: `${this.$users}/login`,
        data: {
          username: 'longlongyu',
          password: '123456'
        },
        headers: {'Access-Token': localStorage.getItem('Access-Token')}
      }).then(response => {
        if (response.data.status === 0) {
          localStorage.setItem('Access-Token', response.data.token)
          this.post.body = '登录成功'
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
