import request from '@/utils/request'

// 登陆接口
// export function login(data) {
//   return request({
//     url: '/sys/login',
//     method: 'post',
//     data
//   })
// }

export const loginAPI = data => request({
  url: '/sys/login',
  method: 'post',
  data
})

export const getUserInfoAPI = () => request({
  url: '/sys/profile',
  method: 'post'
})

export const getUserDetailByIdAPI = id => request({
  url: `/sys/user/${id}`,
  method: 'get'
})

export function logout() {

}
