import request from '@/utils/request'

export function getRoles(params) {
	return request({
		url: '/roles/list',
		method: 'get',
		params: params
	})
}

export function updateRoleMenu(id, data) {
  return request({
    url: '/roles/update/menu/' + id,
    method: 'post',
    data
  })
}

export function updateRolePermission(id, data) {
  return request({
    url: '/roles/update/permission/' + id,
    method: 'post',
    data
  })
}

export function getSingleRole(id) {
  return request({
    url: '/roles/' + id,
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: '/roles/' + id,
    method: 'delete'
  })
}

export function insertRole(data) {
  return request({
    url: '/roles/insert',
    method: 'post',
    data: data
  })
}

export function updateRole(id, data) {
  return request({
    url: '/roles/update/' + id,
    method: 'post',
    data: data
  })
}
