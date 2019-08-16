import request from '@/utils/request'

export function fetchList(params) {
	return request({
		url:'/system/timing/list',
		method:'get',
		params:params
	})
}

export function createJob(data) {
	return request({
		url:'/system/timing/job',
		method:'post',
		data:data
	})
}

export function editJob(id,data) {
	return request({
		url:'/system/timing/job/'+id,
		method:'put',
		data:data
	})
}

export function executeJob(id) {
	return request({
		url:'/system/timing/job/execute_job/'+id,
		method:'put'
	})
}

export function updateJobStatus(id) {
	return request({
		url:'/system/timing/job/update_job_status/'+id,
		method:'put'
	})
}

export function deleteJob(id) {
	return request({
		url:'/system/timing/job/delete_job/'+id,
		method:'delete'
	})
}

export function fetchLogList(params) {
	return request({
		url:'/system/timing/log/list',
		method:'get',
		params:params
	})
}