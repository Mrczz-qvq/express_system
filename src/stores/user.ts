import { defineStore } from 'pinia'
import type { LoginFormData, UserState } from '@/types/login'

import { localStorage } from '@/utils/storage'
import userReq from '@/api/system/user'
import { login, logout } from '@/api/login'

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: localStorage.get('token') || '',
    nickname: '',
    avatar: '/imgs/default_avatar.jpg',
    // roles: [],
    // perms: [],
    idcard: '',
    sex: '',
    phone: '',
    password: '',
  }),

  getters: {
    isLoggedIn(): boolean {
      return this.token !== ''
    },
  },

  actions: {
    getByServerKey(key: string): string|undefined {
      switch (key) {
        case 'id':
          return this.token
        case 'name':
          return this.nickname
        case 'sex':
          return this.sex
        case 'phonenumber':
          return this.phone
        case 'idcard':
          return this.idcard
        default:
          return undefined
      }
    },

    /**
     *  获取用户信息（昵称、头像、角色集合、权限集合）
     */
     async reqUserInfo() {
      if(!this.isLoggedIn || this.nickname) {
        return
      }
      const res = await userReq.get(parseInt(this.token))
      this.nickname = res.data.name
      this.idcard = res.data.idcard
      this.sex = res.data.sex
      this.phone = res.data.phonenumber
      this.password = res.data.password
    },

    /**
     * 登录
     */
     async login(loginData: LoginFormData) {
      const { username, password, code, uuid } = loginData
      const res = await login({
        username: username.trim(),
        password: password,
        grant_type: 'captcha',
        code: code,
        uuid: uuid,
      })
      // const { access_token, token_type } = response.data
      // const accessToken = token_type + ' ' + access_token
      const loginId = res.data
      if (loginId === -1) {
        throw new Error('登录失败！')
      }
      // 实际上并不是token，但权当token用吧
      this.token = String(loginId)
      localStorage.set('token', this.token)
    },

    /**
     *  注销
     */
    async logout() {
      await logout()
      localStorage.remove('token')
      this.$reset()
    },

    /**
     * 清除 Token
     */
    resetToken() {
      localStorage.remove('token')
      this.$reset()
    },
  },
})

export default useUserStore
