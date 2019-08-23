import request from '@/utils/request'

export function getLogList(params) {
	return request({
		url: '/logs/list',
		method: 'get',
		params: params
	})
}

export function getErrorLogList(params) {
	return request({
		url: '/logs/error/list',
		method: 'get',
		params: params
	})
}

export function getUserLogList(params) {
	return request({
		url: '/logs/user/list',
		method: 'get',
		params: params
	})
}
