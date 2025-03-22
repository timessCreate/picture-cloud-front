<template>
  <div id="userManagerView">
    <div class="header-actions">
      <a-space>
        <a-input-search
          v-model:value="searchParams.userName"
          placeholder="请输入用户名"
          style="width: 200px"
          @search="onSearch"
        />
        <a-button type="primary" @click="fetchData">
          <template #icon><SearchOutlined /></template>
          查询
        </a-button>
        <a-button @click="resetSearch">
          <template #icon><ReloadOutlined /></template>
          重置
        </a-button>
      </a-space>
    </div>

    <a-table
      :columns="columns"
      :data-source="userList"
      :pagination="{
        total: total,
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        onChange: onPageChange
      }"
      :loading="loading"
    >
      <!-- 用户角色列 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userRole'">
          <a-tag :color="getRoleTagColor(record.userRole)">
            {{ getRoleText(record.userRole) }}
          </a-tag>
        </template>
        <!-- 头像列 -->
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-avatar :src="record.userAvatar" :size="60">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </template>
        <!-- 操作列 -->
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
            <a-button
              type="link"
              :danger="record.status === 0"
              @click="handleUserStatus(record)"
            >
              {{ record.status === 0 ? '禁用' : '启用' }}
            </a-button>
            <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 0 ? 'green' : 'red'">
            {{ record.status === 0 ? '启用' : '禁用' }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { SearchOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { deleteUserUsingPost, listUserVoByPageUsingPost, updateUserUsingPost } from '../../api/userController'
import dayjs from 'dayjs'
const loading = ref(false)

const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '账号',
    dataIndex: 'userAccount'
  },
  {
    title: '用户名',
    dataIndex: 'userName'
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    width: 80,
    align: 'center',
  },
  {
    title: '简介',
    dataIndex: 'userProfile'
  },
  {
    title: '用户角色',
    dataIndex: 'userRole'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    customRender: ({ text }: { text: string }) => formatTime(text)
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    customRender: ({ text }: { text: string }) => formatTime(text)
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '操作',
    key: 'action',
  }
]

const userList = ref<API.UserVO[]>([])
const total = ref<number>(0)

const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  userName: '',
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await listUserVoByPageUsingPost({...searchParams})

    if(res.data.code === 0 && res.data){
      userList.value = res.data.data?.records ?? []
      total.value = Number(res.data.data?.total)
    } else {
      message.error('获取用户列表失败')
    }
  } catch (error) {
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const onSearch = () => {
  searchParams.current = 1
  fetchData()
}
// 重置搜索
const resetSearch = () => {
  searchParams.userName = ''
  searchParams.current = 1
  fetchData()
}
// 分页
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

const handleEdit = (record: API.UserVO) => {
  console.log('编辑用户:', record)
  // TODO: 实现编辑功能
}

const handleDelete = async (record: API.UserVO) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${record.userName}" 吗？`,
    okText: '确认',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      try {
        const res = await deleteUserUsingPost({id: record.id});
        if (res.data.code === 0) {
          message.success('删除用户成功')
          await fetchData()
        } else {
          message.error(res.data.message || '删除失败')
        }
      } catch (error) {
        message.error('删除失败，请重试')
      }
    }
  })
}

// 用户角色颜色映射
const getRoleTagColor = (role: string) => {
  const colorMap: Record<string, string> = {
    'super_admin': 'purple',
    'admin': 'red',
    'user': 'blue',
    'vip': 'gold'
  }
  return colorMap[role] || 'default'
}

// 用户角色文本映射
const getRoleText = (role: string) => {
  const textMap: Record<string, string> = {
    'super_admin': '超级管理员',
    'admin': '管理员',
    'user': '普通用户',
    'vip': 'VIP用户'
  }
  return textMap[role] || '未知角色'
}

// 处理用户状态（禁用/启用）
const handleUserStatus = async (record: API.UserVO) => {
  try {
    const newStatus = record.status === 0 ? 1 : 0
    // 打印请求参数，检查status是否正确
    console.log('更新用户状态参数:', {
      id: record.id,
      status: newStatus
    })

    const res = await updateUserUsingPost({
      id: record.id,
      status: newStatus  // 确保这里的status是number类型
    })

    if (res.data.code === 0) {
      message.success(`${newStatus === 0 ? '启用' : '禁用'}用户成功`)
      await fetchData()
    } else {
      message.error(res.data.message || '操作失败')
    }
  } catch (error) {
    console.error('更新用户状态失败:', error)
    message.error('操作失败')
  }
}
const formatTime = (time: string) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
}
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#userManagerView {
  padding: 24px;
}

.header-actions {
  margin-bottom: 16px;
}
</style>
