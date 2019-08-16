import request from '@/utils/request'

export function fetchAllBrandList() {
	return request({
	  url:'/brand/listAll',
	  method:'get',
	  data:null
	})
}