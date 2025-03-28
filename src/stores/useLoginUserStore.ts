import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserInfoUsingGet } from '../api/userController'
import { getSpaceVoByUserIdUsingGet } from '../api/spaceController'
/*
  这是一个全局状态管理，用于存储登录用户信息的状态
*/

export const useLoginUserStore = defineStore('userLoginUser', () => {
  // 使用 ref 创建响应式引用
  const userLoginUser = ref<API.LoginUserVO>({})

  // 新增空间相关状态
  const currentSpaceId = ref<number>() // 当前选中的空间ID
  const space = ref<API.SpaceVO>() // 用户空间
  /**
   * 远程获取登录用户信息
   */
  async function fetchLoginUser() {
    try {
      const res = await getLoginUserInfoUsingGet({})
      if (res.data.code === 0 && res.data.data) {
        userLoginUser.value = res.data.data as API.LoginUserVO
      } else {
        console.error('获取用户信息失败:', res)
      }
    } catch (error) {
      console.error('获取用户信息出错:', error)
      // 可以在这里重置用户信息
      userLoginUser.value = {}
    }
  }

  /**
   * 设置登录用户信息
   * @param userLoginUser 登录用户信息
   */
  function setUserLoginUser(newLoginUser: API.LoginUserVO) {
    try {
      console.log('设置新的用户信息:', newLoginUser)
      userLoginUser.value = newLoginUser
      console.log('设置后的用户信息:', userLoginUser.value)
    } catch (error) {
      console.error('设置用户信息出错:', error)
    }
  }

  // 新增：获取用户空间列表的方法
  async function fetchUserSpaces() {
    try {
      const res = await getSpaceVoByUserIdUsingGet({ id: userLoginUser.value.id }, {})
      if (res.data.code === 0 && res.data.data) {
        space.value = res.data.data
        currentSpaceId.value = space.value.id
      }
    } catch (error) {
      console.error('获取空间失败:', error)
    }
  }
  //设置当前空间
  function setCurrentSpaceId(spaceId: number) {
    currentSpaceId.value = spaceId
  }

  //导出数据,其他组件可以调用
  return {
    userLoginUser,
    fetchLoginUser,
    setUserLoginUser,
    // 新增空间相关
    currentSpaceId,
    fetchUserSpaces,
    setCurrentSpaceId,
  }
})
