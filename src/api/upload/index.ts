import { upload } from '@/utils/request'

export const uploadFileApi = (data: Api.Upload.Req)=>{
    const formData = new FormData()
    formData.append('file', data.file)
    return upload<Api.Upload.Resp>('/api/v1/upload', formData)
}