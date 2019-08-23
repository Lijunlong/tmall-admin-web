import request from '@/utils/request'

export function resetEmail(data) {
	return request({
		url: '/code/resetEmail',
		method: 'post',
		data
	})
}

