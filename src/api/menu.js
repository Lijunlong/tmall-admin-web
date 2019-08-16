import request from '@/utils/request'

export function buildMenus() {
  return request({
    url: '/menus/build',
    method: 'get'
  })
}

export function getMenuList(params) {
  return request({
    url: '/menus/list',
    method: 'get',
    params: params
  })
}

export function getMenus() {
  return request({
    url: '/menus/tree',
    method: 'get'
  })
}

export function insertMenu(data) {
  return request({
    url: '/menus/insert',
    method: 'post',
    data: data
  })
}

export function updateMenu(id, data) {
  return request({
    url: '/menus/update/' + id,
    method: 'post',
    data: data
  })
}

export function delMenu(id) {
  return request({
    url: '/menus/delete/' + id,
    method: 'delete'
  })
}