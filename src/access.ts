import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

const checkAccess = async () => {

// 是否为首次获取登录用户
let firstFetchLoginUser = true;


/**
 * 全局权限校验
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.userLoginUser
  // 确保页面刷新，首次加载时，能够等后端返回用户信息后再校验权限
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.userLoginUser
    firstFetchLoginUser = false;
  }
  const toUrl = to.fullPath
  if (toUrl.startsWith('/admin')) {
    if (!loginUser || (loginUser.userRole !== 'admin' && loginUser.userRole !== 'super_admin')) {
      message.error('没有权限,请登录管理员账号访问')
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
  }
  next()
})
}
export default checkAccess
