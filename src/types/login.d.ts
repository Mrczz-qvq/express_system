/**
 * 登录表单类型声明
 */
export interface LoginFormData {
  username: string
  password: string
  grant_type: string
  code: string
  uuid: string
}

/**
 * 登录响应类型声明
 */
export interface LoginResponseData {
  access_token: string
  token_type: string
}

/**
 * 验证码类型声明
 */
export interface Captcha {
  img: string
  uuid: string
}

/**
 * 用户信息store类型声明
 */
export interface UserState {
  token: string  // 实际上就是id
  nickname: string
  avatar: string
  // roles: string[]
  // perms: string[]
  idcard: string
  sex: string
  phone: string
  password: string
}

