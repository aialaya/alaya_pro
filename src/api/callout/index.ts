import { get,post } from '@/utils/request'


export function getTaskListApi() {
  return get<Api.TaskList.Resp>('/api/v1/callout/task')
}


export function getHistoryTaskListApi(params: Api.TaskHistoryList.Req) {
  return get<Api.TaskHistoryList.Resp>('/api/v1/callout/history', params)
}


export function getTaskDetailApi(id:number) {
  return get<Api.TaskDetail.Resp>(`/api/v1/callout/detail/${id}`)
}


export function saveTaskApi(data: Api.SaveTask.Req) {
  return post('/api/v1/callout/submit', data)
}