import request from '@/utils/request'

export const getEmployeeSimpleAPI = () => request({
  url: '/sys/user/simple'
})
