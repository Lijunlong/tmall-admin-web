import request from '@/utils/request'

export function getDictionaryDetailByDictName(dictName) {
	const params = {
		dictName,
		page: 0,
		size: 9999
	  }
	return request({
		url:'/dict/dictDetail',
		method:'get',
		params
	})
}

export function getDictionaryList(params) {
	return request({
		url:'/dict/list',
			method:'get',
			params
	})
}
				
export function deleteDictionary(id) {
	return request({
		url:'/dict/delete/' + id,
			method:'delete'
	})
}

export function insertDictionary(data) {
	return request({
		url:'/dict/insert',
		method:'post',
		data: data
	})
}

export function updateDictionary(id, data) {
	return request({
		url:'/dict/update/' + id,
		method:'post',
		data: data
	})
}

export function getDictionaryDetailList(id, params) {
	return request({
		url:'/dict/' + id + '/list',
        method:'get',
        params
	})
}

export function deleteDictionaryDetail(id) {
	return request({
		url:'/dict/detail/delete/' + id,
			method:'delete'
	})
}

export function insertDictionaryDetail(data) {
	return request({
		url:'/dict/detail/insert',
		method:'post',
		data: data
	})
}

export function updateDictionaryDetail(id, data) {
	return request({
		url:'/dict/detail/update/' + id,
		method:'post',
		data: data
	})
}
