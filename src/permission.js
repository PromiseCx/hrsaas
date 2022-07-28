// 权限拦截在路由跳转，在导航守卫
import router from './router'

// 引入store 相当于this.$store
import store from '@/store'

import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 不需要导出，此文件在main中引入了，代码已经执行了

const whiteList = ['/login', '/404']

// 导航的前置守卫
router.beforeEach((to, from, next) => {
  // 开启进度条
  nprogress.start()
  // next是前置守卫必须要执行的钩子，next必须要执行，不执行 页面就死了next（false）
  // next（地址） 跳转的某个地址
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  // 防止手动切换地址，进度条不关闭现象
  nprogress.done()
})

// 导航的后置守卫
router.afterEach(() => {
  nprogress.done()
})
