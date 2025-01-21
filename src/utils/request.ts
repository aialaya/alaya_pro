import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus'
import i18n from '@/plugins/i18n'



const service: AxiosInstance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })


service.interceptors.request.use(
    (config) => {
      const userStore = useUserStore()
      const token = userStore.token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      config.headers['Accept-Language'] = i18n.global.locale.value
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )


service.interceptors.response.use(
    async (response: AxiosResponse) => {
      return response.data
    },
    async (error) => {
      const userStore = useUserStore()
      if(error.config?.url === "/api/v1/refresh-token"){
        return  Promise.reject(error)
      }
      if (error.response?.status === 401) {
        try {
          await userStore.refreshToken()
          const config = error.config
          return service(config)
        } catch (refreshError) {
          userStore.logout()
          ElMessage.error(i18n.global.t('errors.refreshTokenFailed'))
          location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
      return Promise.reject(error)
    }
  )


export function get<T = any>(url: string,params?:any, config?: AxiosRequestConfig): Promise<Api.Common.Resp<T>> {
    return service.get(url,{ ...config, params })
  }
  

  export function post<T  = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Api.Common.Resp<T>> {
    return service.post(url, data, config)
  }
  

  export function put<T  = Api.Common.Resp>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Api.Common.Resp<T>> {
    return service.put(url, data, config)
  }

  export function del<T  = any>(url: string, config?: AxiosRequestConfig): Promise<Api.Common.Resp<T>> {
    return service.delete(url, config)
  }

  export function upload<T  = any>(url: string, data?: FormData): Promise<Api.Common.Resp<T>> {
    return service.post(url, data, {headers:{'Content-Type':'multipart/form-data'}})
  }
  
  export default service