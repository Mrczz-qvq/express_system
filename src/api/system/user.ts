import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

/**
 * 获取一个用户的地址
 * @param id
 */
const _get = (id: number): AxiosPromise<any> => {
  return request({
    url: '/customer/getinfo',
    method: 'post',
    data: { id },
  })
}


export default {
  get: _get,
}
