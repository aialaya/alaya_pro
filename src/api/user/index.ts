import { get, post } from '@/utils/request'


export function registerApi(data: Api.Register.Req) {
  return post('/api/v1/register', data)
}


export function loginApi(data: Api.Login.Req) {
  return post<Api.Login.Resp>('/api/v1/login', data)
}


export function getUserInfoApi() {
  return get<Api.UserInfo.Resp>('/api/v1/user/info')
}


export function refreshTokenApi(data: Api.RefreshToken.Req) {
  return post<Api.RefreshToken.Resp>('/api/v1/refresh-token', data)
}


export function sendEmailCodeApi(data: Api.SendEmailCode.Req) {
  return post('/api/v1/email/captcha', data)
}


export function emailCaptchaLoginApi(data: Api.EmailCaptchaLogin.Req) {
  return post<Api.EmailCaptchaLogin.Resp>('/api/v1/email/login', data)
}


export function resetPasswordApi(data: Api.ResetPassword.Req) {
  return post('/api/v1/user/reset/password', data)
}


export function getHistoryListApi(data: Api.HistoryList.Req) {
  return get<Api.HistoryList.Resp>('/api/v1/user/score/record', data)
}
