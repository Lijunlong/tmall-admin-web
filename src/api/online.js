import request from '@/utils/request'

export function getOnlineUmsAdminList(params) {
	return request({
	  url:'/online/list',
	  method:'get',
	  params:params
	})
}

export function kickOutUmsAdmin(id) {
	return request({
	  url:'/online/kickOut/' + id,
	  method:'get'
	})
}

