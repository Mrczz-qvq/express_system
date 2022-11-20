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
  const { username, password, role } = data
  const options = {
    url: `/${role}/login`,
    method: 'post',
    data: {
      phonenumber: username,
      password: password,
    } as Object,
    // headers: {
    //   Authorization: 'Basic bWFsbC1hZG1pbi13ZWI6MTIzNDU2',
    // },
  }
  if (role.includes('manager')) {
    options.url = `/manager/${role}login`
    options.data = {
      account: username,
      password: password,
      type: role==='supermanager'? 1: 0,
    }
  }
  return request(options)
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
