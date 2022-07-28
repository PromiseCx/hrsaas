import axios from 'axios'
import { Message } from 'element-ui'

const serivce = axios.create({
  // 该变量有两种可能值，会随着执行的命令根据时开发环境还是生产环境做出改变
  // npm run dev => /api   npm run build => /prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置的超时时间
})

serivce.interceptors.request.use()

// 响应拦截器
serivce.interceptors.response.use(response => {
  const { success, message, data } = response.data
  console.log(success, message, data)
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(error) // 返回错误信息，让当前的执行代码进入执行连的catch
})

export default serivce
