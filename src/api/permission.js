import request from '@/utils/request'

export function getPermissionList(params) {
	return request({
		url: '/permissions/list',
		method: 'get',
		params: params
	})
}

export function delPermissions(id) {
	return request({
		url: '/permissions/delete/' + id,
		method: 'delete'
	})
}

export function getPermissionTree() {
	return request({
		url: '/permissions/tree',
		method: 'get'
	})
}

export function updatePermission(id, data) {
	return request({
		url: '/permissions/update/' + id,
		method: 'post',
		data: data
	})
}

export function createPermission(data) {
	return request({
		url: '/permissions/create/',
		method: 'post',
		data: data
	})
}