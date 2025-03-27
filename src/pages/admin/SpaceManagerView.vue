<template>
  <div id="SpaceManagerView">
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="空间名称" name="spaceName">
        <a-input v-model:value="searchParams.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="searchParams.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请输入空间级别"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户 id" name="userId">
        <a-input v-model:value="searchParams.userId" placeholder="请输入用户 id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
      <a-space>
        <!-- 使用 router-link 包裹按钮 -->
        <router-link to="/space/add">
          <a-button type="primary">添加空间</a-button>
        </router-link>
      </a-space>
    </a-form>

    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
      bordered
      row-key="id"
      @change="handleTableChange"
    >
      <template #emptyText>
        <a-empty description="暂无空间数据" />
      </template>
      <template #bodyCell="{ column, record }">
        <!-- 空间级别带颜色标签 -->
        <template v-if="column.dataIndex === 'spaceLevel'">
          <a-tag :color="getLevelColor(record.spaceLevel)">
            {{ SPACE_LEVEL_MAP[record.spaceLevel] || '未知级别' }}
          </a-tag>
        </template>

        <!-- 使用情况显示优化 -->
        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div class="usage-info">
            <div>存储：{{ formatSize(record.totalSize) }}/{{ formatSize(record.maxSize) }}</div>
            <div>文件：{{ record.totalCount }}/{{ record.maxCount }}</div>
          </div>
        </template>

        <!-- 时间格式化 -->
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm') }}
        </template>

        <template v-if="column.dataIndex === 'editTime'">
          {{ record.editTime ? dayjs(record.editTime).format('YYYY-MM-DD HH:mm') : '-' }}
        </template>

        <!-- 操作按钮 -->
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button
              type="link"
              :href="`/space/edit/${record.id}`"
              target="_blank"
              class="edit-btn"
            >
              <template #icon><EditOutlined /></template>
              编辑
            </a-button>
            <a-button type="link" danger @click="handleDelete(record.id)" class="delete-btn">
              <template #icon><DeleteOutlined /></template>
              删除
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref, h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  deleteSpaceUsingPost,
  listSpaceByPageUsingPost,
  updateSpaceUsingPost,
  getSpaceLevelUsingGet,
} from '@/api/spaceController'
import { SPACE_LEVEL_MAP } from '@/constants/space'
import { SPACE_LEVEL_OPTIONS } from '@/constants/space'
const loading = ref(false)

const columns = ref([
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
    align: 'center',
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
    align: 'center',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
    width: 120,
    align: 'center',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
    align: 'center',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'editTime',
    width: 180,
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
])

// 获取标签颜色
const getLevelColor = (level: number) => {
  return (
    {
      0: 'blue',
      1: 'green',
      2: 'gold',
    }[level] || 'gray'
  )
}

// 数据
const dataList = ref<API.Space[]>([])
const total = ref(0)

// 添加分类选项状态
const categoryOptions = ref<API.SpaceLevel[]>([])

//搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 获取分类选项
const fetchCategories = async () => {
  try {
    const res = await getSpaceLevelUsingGet()
    if (res.data.code === 0 && res.data.data) {
      categoryOptions.value = res.data.data || []
    } else {
      message.error('获取分类失败：' + res.data.message)
    }
  } catch (error) {
    console.error('获取分类失败：', error)
    message.error('获取分类失败')
  }
}

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: Number(total.value),
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    const res = await listSpaceByPageUsingPost({
      ...searchParams,
    })
    if (res.data.data?.records) {
      dataList.value = res.data.data.records.map((item) => ({
        ...item,
        totalSize: Number(item.totalSize) || 0,
        maxSize: Number(item.maxSize) || 0,
        totalCount: Number(item.totalCount) || 0,
        maxCount: Number(item.maxCount) || 0,
      }))
      total.value = res.data.data.total ?? 0
    } else {
      message.error('获取数据失败：' + res.data.message)
    }
  } catch (error) {
    message.error('获取数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索方法
const doSearch = async () => {
  try {
    searchParams.current = 1
    const params = {
      ...searchParams,
      spaceLevel:
        searchParams.spaceLevel != null // 使用 != null 判断
          ? searchParams.spaceLevel
          : undefined,
      userId: searchParams.userId?.toString() || undefined,
      spaceName: searchParams.spaceName?.trim() || undefined,
    }

    const res = await listSpaceByPageUsingPost(params)

    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data.records.map((item) => ({
        ...item,
        totalSize: Number(item.totalSize) || 0,
        maxSize: Number(item.maxSize) || 0,
        totalCount: Number(item.totalCount) || 0,
        maxCount: Number(item.maxCount) || 0,
      }))
      total.value = res.data.data.total ?? 0
    } else {
      message.error(res.data.message || '请求失败')
    }
  } catch (e) {
    message.error('请求失败: ' + (e as Error).message)
    console.error('搜索错误详情:', e)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
  fetchCategories()
})

// 处理删除
const handleDelete = async (id: string) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除这个空间吗？`,
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        loading.value = true
        const res = await deleteSpaceUsingPost({ id })
        if (res.data.code === 0) {
          message.success('删除成功')
          await fetchData()
        } else {
          message.error('删除失败：' + res.data.message)
        }
      } catch (error) {
        message.error('删除失败')
        console.error(error)
      } finally {
        loading.value = false
      }
    },
  })
}

// 文件大小格式化方法（需自行实现）
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 添加分页排序处理方法
const handleTableChange = (
  pag: { current?: number; pageSize?: number },
  filters: any,
  sorter: any,
) => {
  searchParams.current = pag?.current
  searchParams.pageSize = pag?.pageSize
  if (sorter?.field) {
    searchParams.sortField = sorter.field
    searchParams.sortOrder = sorter.order
  }
  fetchData()
}
</script>

<style scoped>
#SpaceManagerView {
  padding: 24px;
}

/* 统一容器样式 */
.ant-form + .ant-table {
  border-top: none;
  border-radius: 0 0 8px 8px;
}

.ant-form {
  background: #fff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: -1px; /* 消除表单和表格之间的间隙 */
  padding: 16px 24px 8px;
}

.ant-table {
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-actions {
  margin-bottom: 16px;
}

.ant-table-cell img {
  object-fit: cover;
  border-radius: 4px;
}

.image-cell {
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.ant-table-cell {
  vertical-align: middle;
  padding: 8px !important;
}

:deep(.ant-image) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.ant-image-img) {
  max-width: 150px;
  max-height: 150px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}

/* 添加预览遮罩样式 */
:deep(.preview-mask) {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
}

.action-column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-column .ant-btn {
  padding: 2px 4px;
  height: auto;
  line-height: 1;
}

.action-column .ant-btn:hover {
  background: rgba(0, 0, 0, 0.025);
}

.action-column .ant-btn-dangerous:hover {
  background: rgba(255, 77, 79, 0.1);
}

.time-column {
  font-size: 12px;
  line-height: 1.5;
}

:deep(.ant-tag-success) {
  background: #f6ffed;
  border-color: #b7eb8f;
  color: #52c41a;
}

:deep(.ant-tag-error) {
  background: #fff2f0;
  border-color: #ffccc7;
  color: #ff4d4f;
}

:deep(.ant-tag-warning) {
  background: #fffbe6;
  border-color: #ffe58f;
  color: #faad14;
}

.category-tag {
  padding: 2px 8px;
  border-radius: 4px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}

.usage-info {
  line-height: 1.5;
  font-size: 12px;
}

.edit-btn {
  padding-left: 0;
}
.delete-btn {
  padding-left: 8px;
}

:deep(.ant-tag) {
  margin-right: 0;
}
</style>
