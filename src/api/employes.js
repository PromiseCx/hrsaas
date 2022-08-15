import request from '@/utils/request'

export const getEmployeeSimpleAPI = () => request({
  url: '/sys/user/simple'
})

export const getEmployeeListAPI = params => request({
  url: '/sys/user',
  params
})

export const delEmployeeAPI = id => request({
  url: `/sys/user/${id}`,
  method: 'delete'
})

export const addEmployeeAPI = data => request({
  method: 'post',
  url: '/sys/user',
  data
})

export const importEmployeeAPI = data => request({
  url: '/sys/user/batch',
  method: 'post',
  data
})

export const saveUserDetailByIdAPI = data => request({
  url: `/sys/user/${data.id}`,
  method: 'put',
  data
})

export const getPersonalDetailAPI = id => request({
  url: `/employees/${id}/personalInfo`
})

export const updatePersonalAPI = data => request({
  url: `/employees/${data.userId}/personalInfo`,
  method: 'put',
  data
})

export const getJobDetailAPI = id => request({
  url: `/employees/${id}/jobs`
})

export const updateJobAPI = data => request({
  url: `/employees/${data.userId}/jobs`,
  method: 'put',
  data
})

export const assignRolesAPI = data => request({
  url: '/sys/user/assignRoles',
  data,
  method: 'put'
})

