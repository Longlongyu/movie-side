import Vue from 'vue'
import Router from 'vue-router'
import User from '@/components/User'
import UserProps from '@/components/UserProps'
import Post from '@/components/Post'

const VIP = {template: ''}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['../pages/index'], resolve),
      meta: {
        title: 'home'
      }
    },
    {
      path: '/user/:id',
      component: User,
      name: 'user',
      children: [
        {
          path: 'vip',
          component: VIP
        }
      ]
    },
    {
      path: '/post',
      name: 'post',
      component: Post
    },
    {
      path: '/UserProps/:id',
      name: 'userprops',
      component: UserProps,
      props: true
    }
  ]
})
