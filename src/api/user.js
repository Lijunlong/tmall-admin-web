import request from '@/utils/request'

export function fetchUserList(params) {
  return request({
    url: '/users/list',
    method: 'get',
    params: params
  })
}

export function updateUser(id, data) {
  return request({
    url: '/users/update/' + id,
    method: 'post',
    data: data
  })
}

export function createUser(data) {
  return request({
    url: '/users/create',
    method: 'post',
    data: data
  })
}

export function deleteUser(id) {
  return request({
    url: '/users/delete/' + id,
    method: 'delete'
  })
}
