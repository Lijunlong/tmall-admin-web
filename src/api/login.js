import request from '@/utils/request'

export function login(username, password, code, uuid) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function updatePass(data) {
  return request({
    url: '/admin/update_pass',
    method: 'post',
    data: data
  })
}

export function getCodeImg() {
  return request({
    url: '/admin/vCode',
    method: 'get'
  })
}
