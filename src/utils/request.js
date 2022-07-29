import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
import router from '@/router'

const serivce = axios.create({
  // 该变量有两种可能值，会随着执行的命令根据时开发环境还是生产环境做出改变
  // npm run dev => /api   npm run build => /prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置的超时时间
})

const TimeOut = 3600

// 请求拦截器
serivce.interceptors.request.use(config => {
  if (store.getters.token) {
    if (CheckTimeOut()) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时了!'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
serivce.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error) // 返回错误信息，让当前的执行代码进入执行连的catch
})

function CheckTimeOut() {
  var currentTime = Date.now()
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default serivce
