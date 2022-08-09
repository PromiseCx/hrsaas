import request from '@/utils/request'

export const getRoleListAPI = params => request({
  url: '/sys/role',
  params
})

export const getCompanyInfoAPI = companyId => request({
  url: `/company/${companyId}`,
  method: 'get'
})

export const deleteRoleAPI = id => request({
  url: `/sys/role/${id}`,
  method: 'delete'
})

export const updateRoleAPI = data => request({
  url: `/sys/role/${data.id}`,
  method: 'put',
  data
})

export const getRoleDetailAPI = id => request({
  url: `/sys/role/${id}`
})

export const addRoleAPI = data => request({
  url: '/sys/role',
  method: 'post',
  data
})
