import request from '@/utils/request'

// 登陆接口
// export function login(data) {
//   return request({
//     url: '/sys/login',
//     method: 'post',
//     data
//   })
// }

export const login = data => request({
  url: '/sys/login',
  method: 'post',
  data
})

export function getInfo(token) {

}

export function logout() {

}
