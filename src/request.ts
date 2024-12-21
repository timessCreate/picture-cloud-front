import { message } from 'ant-design-vue'
import axios from 'axios'

const myAxios = axios.create({
  baseURL: 'http://localhost:8123',
  timeout: 60000,
  // 允许携带cookie
  withCredentials: true,
})

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    console.log(config.socketPath)
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    const data = response
    if (data.code === 40100) {
      // 40100 表示未登录，但不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录界面
      if (
        !response.request.responseURL.includes('/user/get/login') &&
        window.location.pathname !== '/user/login'
      ) {
        message.warning('请先登录')
        //保留原页面,跳转到登录界面,登录成功后,跳转到原页面
        window.location.href = '/user/login?redirect=' + window.location.href
      }
    }
    if (data.code === 50000) {
      message.error('服务器错误,请联系管理员')
    }
    // TODO: 添加错误码处理
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

export default myAxios
