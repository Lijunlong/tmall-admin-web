import request from '@/utils/request'

export function fetchJokeList(params) {
	return request({
		url:'/timing/joke/list',
		method:'get',
		params:params
	})
}

