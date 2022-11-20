import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { OrderFormData } from '@/types/order'
import useStore from '@/stores'

const _get = (id: number): AxiosPromise<any> => {
  return request({
    url: '/express/getinfo',
    method: 'post',
    data: { id, },
  })
}

const _getallByUID = (id: string): AxiosPromise<any> => {
  return request({
    url: '/customer/getexpress',
    method: 'post',
    data: { id, },
  })
}

const _add = (data: OrderFormData): AxiosPromise<any> => {
  const { user } = useStore()
  return request({
    url: '/express/insert',
    method: 'post',
    data: {
      customerid: user.token,
      type: data.type,
      sendaddress: data.sender.address,
      receiveaddress: data.receiver.address,
      sendname: data.sender.name,
      receivename: data.receiver.name,
      sendphone: data.sender.phone,
      receivephone: data.receiver.phone,
      context: data.orderType,
      freight: data.price,
    },
  })
}

const _pick = (id: number): AxiosPromise<any> => {
  return request({
    url: '/express/pickexpress',
    method: 'post',
    data: { id, }
  })
}

const _sign = (id: number, signname: string): AxiosPromise<any> => {
  return request({
    url: '/express/signexpress',
    method: 'post',
    data: { id, signname, }
  })
}

export default {
  get: _get,
  getall: _getallByUID,
  add: _add,
  pick: _pick,
  sign: _sign,
}
