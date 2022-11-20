import type {
  Captcha,
  LoginFormData,
} from '@/types/login'
import request from '@/utils/request'
import type { AxiosPromise } from 'axios'

/**
 * 登录
 * @param data
 */
export function login(data: LoginFormData): AxiosPromise<number> {
  return request({
    url: '/customer/login',
    method: 'post',
    data: {
      phonenumber: data['username'],
      password: data['password'],
    },
    // headers: {
    //   Authorization: 'Basic bWFsbC1hZG1pbi13ZWI6MTIzNDU2',
    // },
  })
}

/**
 * 注销
 */
export function logout() {
  return request({
    url: '/customer/logout',
    method: 'delete',
  })
}

/**
 * 获取图片验证码
 */
export function getCaptcha(): AxiosPromise<Captcha> {
  return request({
    url: '/captcha?t=' + new Date().getTime().toString(),
    method: 'get',
  })
}
