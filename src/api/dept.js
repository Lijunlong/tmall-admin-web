import request from '@/utils/request'

export function getDeptList(params) {
  return request({
    url: '/department/list',
    method: 'get',
    params
  })
}

export function getDepts() {
  return request({
    url: '/department/tree',
    method: 'get'
  })
}

export function delDept(id) {
  return request({
    url: '/department/delete/' + id,
    method: 'delete'
  })
}

export function updateDept(id, data) {
  return request({
    url: '/department/update/' + id,
    method: 'post',
    data: data
  })
}

export function insertDept(data) {
  return request({
    url: '/department/insert',
    method: 'post',
    data: data
  })
}