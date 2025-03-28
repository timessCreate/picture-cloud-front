<template>
  <div class="space-detail-container">
    <div class="container">
      <a-spin :spinning="loading">
        <a-empty
          v-if="pictures.length === 0 && !loading"
          description="暂无图片，快去上传吧！"
          class="empty-tip"
        >
          <a-button type="primary" @click="handleUpload">立即上传</a-button>
        </a-empty>

        <!-- 恢复原始瀑布流布局 -->
        <div v-else class="image-grid">
          <div class="waterfall">
            <div v-for="item in pictures" :key="item.id" class="image-item">
              <div class="image-card" @click="handleImageClick(item)">
                <div class="image-wrapper">
                  <a-image :src="item.url" :preview="false" />
                </div>
                <div class="card-footer">
                  <h3 class="title">{{ item.name }}</h3>
                  <div class="footer-meta">
                    <span class="time">{{ formatDate(item.createTime || '') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页器 -->
        <div class="pagination" v-if="pictures.length > 0">
          <a-pagination
            v-model:current="currentPage"
            :total="total"
            :pageSize="pageSize"
            @change="handlePageChange"
            show-quick-jumper
          />
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { getSpaceVoByIdUsingGet, getSpaceVoByUserIdUsingGet } from '@/api/spaceController'
import { listPictureVoByPageUsingPost } from '@/api/pictureController'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

//业务逻辑梳理
//用户未登录，则跳转登录页
//用户已登录，获取该用户创建的空间
// 1. 如果有则进入该空间
// 2. 如果没有则跳转创建空间页
const router = useRouter()
const loginUserStore = useLoginUserStore()
const space = ref<API.SpaceVO | null>(null)
//检查是否有个人空间
const checkUserSpace = async () => {
  try {
    const loginUser = loginUserStore.userLoginUser
    if (!loginUser?.id) {
      await router.replace('/user/login') // 等待路由跳转完成
      return Promise.reject('未登录') // 主动中断后续执行
    }

    const res = await getSpaceVoByUserIdUsingGet({ id: loginUser.id })
    if (res.data.code !== 0 || !res.data.data) {
      await router.replace('/space/add') // 等待路由跳转
      return Promise.reject('无空间') // 中断执行流
    }
    space.value = res.data.data
    console.log('Space initialized:', space.value) // 确认赋值
    return Promise.resolve() // 明确返回成功状态
  } catch (error) {
    return Promise.reject(error)
  }
}

onMounted(async () => {
  try {
    await checkUserSpace()
    console.log('After checkUserSpace, space:', space.value) // 检查此时是否有值
    await loadPictures()
  } catch (error) {
    console.error('初始化失败:', error)
  }
})
const handleUpload = () => {
  router.replace('/add_picture')
}

// 新增分页相关逻辑
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const loading = ref(false)
const pictures = ref<API.PictureVO[]>([])
const loadPictures = async () => {
  try {
    if (!space.value?.id) {
      console.error('spaceId为空:', space.value)
      throw new Error('无效的空间ID')
    }

    loading.value = true
    const res = await listPictureVoByPageUsingPost({
      spaceId: space.value.id, // 直接使用已确认存在的id
      current: currentPage.value,
      pageSize: pageSize.value,
      sortField: 'createTime',
      sortOrder: 'descend',
    })

    if (res.data.code === 0 && res.data.data) {
      pictures.value = res.data.data.records || []
      total.value = res.data.data.total || 0
    }
  } catch (error) {
    message.error('加载失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    // 检查是否为有效日期
    if (isNaN(date.getTime())) {
      return null
    }
    return date.toLocaleDateString()
  } catch (e) {
    return null
  }
}
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadPictures()
}

// 添加图片点击处理
const handleImageClick = (item: API.PictureVO) => {
  router.push({
    path: `/picture/${item.id}`,
  })
}

// 添加watch监听
watch(
  () => space.value?.id,
  (newVal) => {
    if (newVal) {
      loadPictures()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* 空状态样式 */
.empty-tip {
  margin: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-image {
  width: 200px;
  margin-bottom: 24px;
}

/* 分页居中 */
.pagination {
  margin: 40px 0;
  display: flex;
  justify-content: center;
}

/* 瀑布流布局 */
.image-grid {
  padding: 16px 0;
}

.image-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.image-wrapper {
  position: relative;
  padding-top: 100%; /* 保持1:1宽高比 */
}

.image-wrapper :deep(.ant-image) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.container {
  max-width: 1600px;
  margin: 20px auto;
  padding: 0 24px;
}

.image-info {
  padding: 12px;
  flex-grow: 1;
}

.image-title {
  font-size: 14px;
  margin-bottom: 8px;
}

.tags {
  margin: 8px 0;
}

.image-meta {
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
}

.card-footer {
  padding: 12px;
}

.title {
  font-size: 14px;
  margin-bottom: 8px;
}

.footer-meta {
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.username {
  margin-left: 8px;
}

.time {
  margin-left: 8px;
}

.image-meta-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.meta-content {
  text-align: center;
}

.stats {
  margin-top: 8px;
}

.hover-zoom {
  transition: transform 0.3s;
}

.hover-zoom:hover {
  transform: scale(1.05);
}

/* 响应式调整 */
@media (max-width: 1600px) {
  .image-grid {
    column-count: 4;
  }
}

@media (max-width: 1200px) {
  .image-grid {
    column-count: 3;
  }
}

@media (max-width: 992px) {
  .image-grid {
    column-count: 2;
  }
}

@media (max-width: 576px) {
  .image-grid {
    column-count: 1;
  }
}
</style>
