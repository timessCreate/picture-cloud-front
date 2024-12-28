import axios from 'axios'

const myAxios = axios.create({
  baseURL: 'http://localhost:8123',
  timeout: 60000,
  // 允许携带cookie
  withCredentials: true,
})

// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    console.log(`请求路径: ${config.baseURL}${config.url}`)
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    console.log('进入响应拦截器 --> 完整的响应对象:', response)
    return response.data
  },
  function (error) {
    console.log('进入错误处理')
    // 记录错误日志
    console.error('API Error:', error)
    // 只处理网络层面的错误
    if (!error.response) {
      return Promise.reject(new Error('网络错误，请检查您的网络连接'))
    }

    return Promise.reject(error)
  }
)

export default myAxios
