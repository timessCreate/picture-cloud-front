import axios from 'axios'
import JSONBIG from 'json-bigint'

const myAxios = axios.create({
  baseURL: 'http://localhost:8123',
  timeout: 60000,
  // 允许携带cookie
  withCredentials: true,
  transformRequest: [
    function (data) {
      if (data instanceof FormData) {
        return data
      }
      return JSONBIG.stringify(data)
    },
  ],
  transformResponse: [
    function (data) {
      try {
        return JSONBIG({ storeAsString: true }).parse(data)
      } catch (e) {
        return data
      }
    },
  ],
  headers: {
    'Content-Type': 'application/json',
  },
})

// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    //console.log(`请求路径: ${config.baseURL}${config.url}`)
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
    //console.log('进入响应拦截器 --> 完整的响应对象:', response)
    return response
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
  },
)

export default myAxios
