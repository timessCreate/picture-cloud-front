<template>
  <div id="pictureManagerView">
    <div class="header-actions">
      <a-form layout="inline">
        <a-form-item label="搜索">
          <a-input
            v-model:value="searchParams.searchText"
            placeholder="请输入图片名称或简介"
            style="width: 300px"
            allowClear
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="分类">
          <a-select
            v-model:value="searchParams.category"
            placeholder="请选择分类"
            style="width: 200px"
            allowClear
          >
            <a-select-option
              v-for="category in categoryOptions"
              :key="category"
              :value="category"
            >
              {{ category }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              查询
            </a-button>
            <a-button @click="handleReset">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
      @change="doTableChange"
    >
    <template #bodyCell="{ column, record }">
  <template v-if="column.dataIndex === 'url'">
    <div class="image-cell">
      <a-image
        :src="record.url"
        :preview="{
          src: record.url,
          mask: '预览图片'
        }"
      />
    </div>
  </template>
  <!-- 标签 -->
  <template v-if="column.dataIndex === 'tags'">
    <a-space wrap>
      <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{ tag }}</a-tag>
    </a-space>
  </template>
  <!-- 图片信息 -->
  <template v-if="column.dataIndex === 'picInfo'">
    <div>
      <div>格式：{{ record.picFormat || '-' }}</div>
      <div>尺寸：{{ record.picWidth || 0 }} x {{ record.picHeight || 0 }}</div>
      <div>宽高比：{{ calculateAspectRatio(record.picWidth, record.picHeight) }}</div>
      <div>大小：{{ formatFileSize(record.picSize || 0) }}</div>
    </div>
  </template>
  <template v-else-if="column.dataIndex === 'createTime'">
    {{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
  </template>
  <template v-else-if="column.dataIndex === 'editTime'">
    {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
  </template>
  <template v-else-if="column.key === 'action'">
    <a-space>
      <a-button type="link" @click="handleEdit(record)">编辑</a-button>
      <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
    </a-space>
  </template>
</template>

    </a-table>

    <!-- 编辑对话框 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑图片"
      @ok="handleEditSubmit"
      :confirmLoading="loading"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="图片名称" required>
          <a-input v-model:value="editForm.name" placeholder="请输入图片名称" />
        </a-form-item>
        <a-form-item label="图片简介">
          <a-textarea
            v-model:value="editForm.introduction"
            placeholder="请输入图片简介"
            :rows="4"
          />
        </a-form-item>
        <a-form-item label="分类">
          <a-select
            v-model:value="editForm.category"
            placeholder="请选择分类"
            allowClear
          >
            <a-select-option
              v-for="category in categoryOptions"
              :key="category"
              :value="category"
            >
              {{ category }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标签">
          <a-select
            v-model:value="editForm.tags"
            mode="tags"
            placeholder="请输入标签"
            style="width: 100%"
          >
            <a-select-option v-for="tag in tagOptions" :key="tag" :value="tag">
              {{ tag }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { SearchOutlined, ReloadOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { deleteUserUsingPost, listUserVoByPageUsingPost, updateUserUsingPost } from '../../api/userController'
import { deletePictureUsingPost, listPictureByPageUsingPost, updatePictureUsingPost, listPictureTagCategoryUsingGet } from '@/api/pictureController'

const loading = ref(false)
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '图片',
    dataIndex: 'url',
    width: 180,
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    width: 120,
    ellipsis: true,
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
    width: 150,
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 100,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 150,
  },
  {
    title: '上传者',
    dataIndex: 'userId',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
    width: 160,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
]


// 数据
const dataList = ref([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
  searchText: undefined,
  category: undefined,
})

// 标签选项
const tagOptions = ref<string[]>([
  '自然', '城市', '美食', '旅行', '动物', '人像',
  '风景', '建筑', '艺术', '生活', '其他'
])

// 添加分类选项状态
const categoryOptions = ref<string[]>([])

// 获取分类选项
const fetchCategories = async () => {
  try {
    const res = await listPictureTagCategoryUsingGet()
    if (res.data.code === 0 && res.data.data) {
      categoryOptions.value = res.data.data.categoryList || []
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

// 添加文件大小格式化函数
const formatFileSize = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    const res = await listPictureByPageUsingPost(searchParams)
    if (res.data.code === 0) {
      dataList.value = res.data.data.records ?? []
      total.value = Number(res.data.data.total) ?? 0
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

// 页面加载时请求一次
onMounted(() => {
  fetchData()
  fetchCategories()
})

// 搜索
const handleSearch = () => {
  searchParams.current = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchParams.searchText = undefined
  searchParams.category = undefined
  searchParams.current = 1
  fetchData()
}


// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 处理删除
const handleDelete = async (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除"${record.name}"这张图片吗？`,
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        loading.value = true
        const res = await deletePictureUsingPost({ id: record.id })
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
    }
  })
}

// 编辑对话框显示状态
const editModalVisible = ref(false)
// 当前编辑的图片数据
const editForm = reactive({
  id: undefined,
  name: '',
  introduction: '',
  category: undefined,
  tags: [],
})

// 处理编辑按钮点击
const handleEdit = (record: any) => {
  editForm.id = record.id
  editForm.name = record.name
  editForm.introduction = record.introduction
  editForm.category = record.category
  // 修改标签的解析方式
  try {
    editForm.tags = typeof record.tags === 'string' ? JSON.parse(record.tags) : record.tags || []
  } catch (e) {
    editForm.tags = []
  }
  editModalVisible.value = true
}

// 处理编辑提交
const handleEditSubmit = async () => {
  try {
    loading.value = true
    const params = {
      id: editForm.id,
      name: editForm.name,
      introduction: editForm.introduction,
      category: editForm.category,
      tags: editForm.tags  // 直接传递数组，不需要JSON.stringify
    }

    const res = await updatePictureUsingPost(params)
    if (res.data.code === 0) {
      message.success('编辑成功')
      editModalVisible.value = false
      await fetchData() // 刷新列表
    } else {
      message.error('编辑失败：' + res.data.message)
    }
  } catch (error) {
    message.error('编辑失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 在 script setup 部分添加宽高比计算函数
const calculateAspectRatio = (width: number, height: number) => {
  if (!width || !height) return '-';
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width/divisor}:${height/divisor}`;
}
</script>

<style scoped>
#userManagerView {
  padding: 24px;
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
</style>
