import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

/**
 * 获取一个用户的地址
 * @param uid
 */
const _get = (uid: string): AxiosPromise<any> => {
  return request({
    url: '/comaddress/getcustomeraddress',
    method: 'post',
    data: { uid, },
    // headers: {
    //   Authorization: 'Basic bWFsbC1hZG1pbi13ZWI6MTIzNDU2',
    // },
  })
}

const _delete = (id: number): AxiosPromise<any> => {
  return request({
    url: '/comaddress/delete',
    method: 'post',
    data: { id },
  })
}

const _add = (uid: string, address: string): AxiosPromise<any> => {
  return request({
    url: '/comaddress/insert',
    method: 'post',
    data: { uid, address, }
  })
}

const _update = (id: number, address: string): AxiosPromise<any> => {
  return request({
    url: '/comaddress/update',
    method: 'post',
    data: { id, address, }
  })
}

export default {
  get: _get,
  delete: _delete,
  add: _add,
  update: _update,
}
