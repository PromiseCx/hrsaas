import request from '@/utils/request'

export const getDepartmentsAPI = () => request({
  url: '/company/department',
  method: 'get'
})

export const deleteDepartmentsAPI = id => request({
  url: `/company/department/${id}`,
  method: 'delete'
})

export const addDepartmentsAPI = data => request({
  url: '/company/department',
  method: 'post',
  data
})

export const getDepartDetailsAPI = id => request({
  url: `/company/department/${id}`,
  method: 'get'
})

export const updateDepartmentsAPI = data => request({
  url: `/company/department/${data.id}`,
  method: 'put',
  data
})
