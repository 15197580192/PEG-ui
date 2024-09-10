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
 * sparal查询
 * @param query
 * @returns {AxiosPromise}
 */
export function query(query) {
  return request({
    url: '/query',
    method: 'get',
    params: query
  })
}
