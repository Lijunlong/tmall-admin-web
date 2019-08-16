import request from '@/utils/request'

export function getRoles(params) {
	return request({
		url:'/roles/list',
		method:'get',
		params
	})
}