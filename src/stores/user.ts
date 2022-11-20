import { defineStore } from 'pinia'
import type { LoginFormData, UserState } from '@/types/login'

import { localStorage } from '@/utils/storage'
import userReq from '@/api/system/user'
import { login, logout } from '@/api/login'

const tokenName = 'expresSys_token@role'

const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => {
    const [token, role] = (localStorage.get(tokenName) || '@').split('@')
    return {
      token,
      nickname: '',
      avatar: '/imgs/default_avatar.jpg',
      role,
      // perms: [],
      idcard: '',
      sex: '',
      phone: '',
      password: '',
    }
  },

  getters: {
    isLoggedIn(): boolean {
      return this.token !== ''
    },
    isCustomer(): boolean {
      return this.role === 'customer'
    },
    isSupAdmin(): boolean {
      return this.role === 'supermanager'
    },
  },

  actions: {
    hasAuth(tgtRole: string|null): boolean {
      // null 是 supermanager  的缩略，毕竟绝不会跟role等价
      return this.isSupAdmin || this.role === tgtRole
    },

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
      const res = await userReq.get(this.token, this.role)
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
      loginData.username = loginData.username.trim()
      const res = await login(loginData)
      // const { access_token, token_type } = response.data
      // const accessToken = token_type + ' ' + access_token
      const loginId = res.data
      if (loginId === 0) {
        throw new Error('登录失败！')
      }
      // 实际上并不是token，但权当token用吧
      this.role = loginData.role
      this.token = String(loginId)
      localStorage.set('expresSys_token@role', `${loginId}@${this.role}`)
    },

    /**
     *  注销
     */
    async logout() {
      await logout()
      this.resetToken()
    },

    /**
     * 清除 Token
     */
    resetToken() {
      localStorage.remove(tokenName)
      this.$reset()
    },
  },
})

export default useUserStore
