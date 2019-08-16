import request from '@/utils/request'

export function getJobs(params) {
	return request({
		url:'/jobs/list',
			method:'get',
			params
	})
}

export function deleleJob(id) {
	return request({
		url:'/jobs/delete/' + id,
			method:'delete'
	})
}

export function insertJob(data) {
	return request({
		url:'/jobs/insert',
		method:'post',
		data: data
	})
}

export function updateJob(id, data) {
	return request({
		url:'/jobs/update/' + id,
		method:'post',
		data: data
	})
}
