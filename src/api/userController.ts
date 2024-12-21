// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** getUserInfo GET /api/user/info */
export async function getUserInfoUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/user/info', {
    method: 'GET',
    ...(options || {}),
  })
}
