import request from '@/utils/request'

/**
 * 获取数据库列表
 * @param query
 * @returns {AxiosPromise}
 */
export function databaseList(query) {
  return request({
    url: '/getDBList',
    method: 'get',
    params: query
  })
}

/**
 * 新增数据库
 * @param query
 * @returns {AxiosPromise}
 */
export function addDatabase(query) {
  return request({
    url: '/build',
    method: 'get',
    params: query
  })
}
/**
 * 删除数据库
 * @param query
 * @returns {AxiosPromise}
 */
export function delDatabase(query) {
  return request({
    url: '/deleteDB',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    //url: '/vue-element-admin/article/list',
    url: '/nodeConfig',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
