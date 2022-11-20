import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

/**
 * 获取一个用户的地址
 * @param id
 */
const _get = (id: string, role: string): AxiosPromise<any> => {
  if (role.includes('manager')) {
    role = 'manager'
  }
  return request({
    url: `/${role}/getinfo`,
    method: 'post',
    data: { id },
  })
}


export default {
  get: _get,
}
