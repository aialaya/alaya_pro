import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi, refreshTokenApi, emailCaptchaLoginApi } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as Api.UserInfo.Resp | null,
    token: localStorage.getItem('KEY_TOKEN') || '',
    isAuthenticated: false,
    language: localStorage.getItem('language') || 'en-US'
  }),
  
  actions: {
    setUserInfo(userInfo: Api.UserInfo.Resp) {
      this.userInfo = userInfo
      this.isAuthenticated = true
    },
    setLanguage(lang: string) {
      this.language = lang
      localStorage.setItem('language', lang)
    },
    setToken(token: string,accessToken: string) {
      this.token = token
      localStorage.setItem('KEY_TOKEN', token)
      localStorage.setItem('KEY_REFRESH_TOKEN', accessToken)
    },
    async login(params: Api.Login.Req) {
      const data = await loginApi(params)
      if (data.code == 200) {
        this.setToken(data.data!.accessToken,data.data!.refreshToken)
      } else {
        throw new Error(data.message)
      }
    },
    async emailCaptchaLogin(params: Api.EmailCaptchaLogin.Req) {
      const data = await emailCaptchaLoginApi(params)
      if (data.code == 200) {
        this.setToken(data.data!.accessToken,data.data!.refreshToken)
      } else {
        throw new Error(data.message)
      }
    },
    async getUserInfo(isRefresh: boolean = false) {
      if (this.userInfo && !isRefresh) {
        return
      }
      const data = await getUserInfoApi()
      if (data.code == 200) {
        this.setUserInfo(data.data!)
      } else {
        throw new Error(data.message)
      }
    },
    async refreshToken() {
      const refreshToken = localStorage.getItem('KEY_REFRESH_TOKEN')
      if (!refreshToken) {
        return
      }
      const data = await refreshTokenApi({refreshToken})
      if (data.code == 200) {
        this.setToken(data.data!.accessToken,data.data!.refreshToken)
      } else {
        throw new Error(data.message)
      }
    },
    logout() {
      this.userInfo = null
      this.token = ''
      this.isAuthenticated = false
      localStorage.removeItem('KEY_TOKEN')
      localStorage.removeItem('KEY_REFRESH_TOKEN')
    }
  }
}) 