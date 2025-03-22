<template>
  <div class="picture-detail">
    <a-spin :spinning="loading">
      <div v-if="picture" class="detail-container">
        <!-- 返回按钮 -->
        <div class="back-button">
          <a-button type="link" @click="router.back()">
            <template #icon><left-outlined /></template>
            返回
          </a-button>
        </div>

        <div class="content-layout">
          <!-- 左侧图片展示区 -->
          <div class="image-section">
            <a-image
              :src="picture.url"
              :preview="{
                src: picture.url,
                maskClassName: 'preview-mask'
              }"
            />
          </div>

          <!-- 右侧信息区 -->
          <div class="info-section">
            <h1 class="title">{{ picture.name }}</h1>

            <!-- 基本信息卡片 -->
            <div class="info-card">
              <div class="info-row">
                <div class="info-label bg-blue">图片信息</div>
                <div class="info-value image-specs">
                  <span>
                    {{ picture.picWidth }} × {{ picture.picHeight }} px
                    <span v-if="picture.picScale" class="scale-info">
                      ({{ picture.picScale }})
                    </span>
                  </span>
                  <span class="divider">|</span>
                  <span>{{ formatFileSize(picture.picSize) }}</span>
                  <span class="divider">|</span>
                  <span>{{ picture.picFormat?.toUpperCase() }}</span>
                </div>
              </div>

              <div class="info-row">
                <div class="info-label bg-green">分类</div>
                <div class="info-value">
                  <a-tag color="blue">{{ picture.category }}</a-tag>
                </div>
              </div>

              <div class="info-row">
                <div class="info-label bg-purple">标签</div>
                <div class="info-value tags-wrapper">
                  <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </div>
              </div>

              <div class="info-row">
                <div class="info-label bg-orange">上传时间</div>
                <div class="info-value">{{ formatDate(picture.createTime) }}</div>
              </div>

              <div class="info-row">
                <div class="info-label bg-cyan">更新时间</div>
                <div class="info-value">{{ formatDate(picture.updateTime) }}</div>
              </div>

              <div class="info-row">
                <div class="info-label bg-pink">上传用户</div>
                <div class="info-value user-info">
                  <span class="user-id">ID: {{ picture.userId }}</span>
                </div>
              </div>

              <!-- 简介单独一行 -->
              <div class="info-row description-row">
                <div class="info-label bg-gold">简介</div>
                <div class="info-value description">
                  {{ picture.introduction || '暂无简介' }}
                </div>
              </div>

              <!-- 下载按钮 -->
              <div class="download-section">
                <a-button
                  type="primary"
                  size="large"
                  :href="picture.url"
                  target="_blank"
                  download
                >
                  <template #icon><download-outlined /></template>
                  下载图片
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { LeftOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { getPictureVoByIdUsingGet } from '@/api/pictureController'
import type { PictureVO } from '@/api/typings'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const picture = ref<PictureVO>()

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 解析标签
const parseTags = (tags: string | undefined | null) => {
  if (!tags) return []
  return typeof tags === 'string' ? tags.split(',') : []
}

// 获取图片详情
const fetchPictureDetail = async () => {
  const id = route.params.id
  if (!id) {
    message.error('图片ID不存在')
    router.push('/')
    return
  }

  loading.value = true
  try {
    const res = await getPictureVoByIdUsingGet({ id })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败：' + res.data.message)
      router.push('/')
    }
  } catch (error) {
    console.error('获取图片详情失败：', error)
    message.error('获取图片详情失败')
    router.push('/')
  } finally {
    loading.value = false
  }
}

// 格式化文件大小
const formatFileSize = (size: number | undefined) => {
  if (!size) return '未知'
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

onMounted(() => {
  fetchPictureDetail()
})
</script>


<style scoped>
.picture-detail {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 120px);  /* 64px header + 56px footer */
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.detail-container {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.back-button {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.content-layout {
  display: flex;
  flex: 1;  /* 让内容区域填充剩余空间 */
  min-height: 0;  /* 防止溢出 */
}

.image-section {
  flex: 2;
  padding: 24px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #f0f0f0;
  overflow: auto;  /* 允许图片区域滚动 */
}

:deep(.ant-image) {
  max-width: 100%;
  max-height: calc(100vh - 250px);
}

:deep(.ant-image-img) {
  max-width: 100%;
  max-height: calc(100vh - 250px);
  object-fit: contain;
}

.info-section {
  flex: 1;
  padding: 24px;
  overflow-y: auto;  /* 允许信息区域滚动 */
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.info-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.info-label {
  padding: 4px 12px;
  border-radius: 4px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  min-width: 80px;
  text-align: center;
}

/* 不同背景色 */
.bg-blue { background-color: #1890ff; }
.bg-green { background-color: #52c41a; }
.bg-purple { background-color: #722ed1; }
.bg-orange { background-color: #fa8c16; }
.bg-cyan { background-color: #13c2c2; }
.bg-pink { background-color: #eb2f96; }
.bg-gold { background-color: #faad14; }

.info-value {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.image-specs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 14px;
}

.scale-info {
  color: #666;
  font-size: 13px;
  margin-left: 4px;
}

.divider {
  color: #d9d9d9;
  margin: 0 8px;
}

.description-row {
  flex-direction: column;
  align-items: flex-start;
  margin-top: 16px;
  margin-bottom: 16px;
}

.description {
  margin-top: 8px;
  background: white;
  padding: 12px 16px;
  border-radius: 6px;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.6;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: relative;
}

.description::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  height: 3px;
  background: #faad14;
  border-radius: 6px 6px 0 0;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-id {
  color: #666;
}

.user-name {
  color: #1890ff;
  font-weight: 500;
}

.download-section {
  margin-top: 24px;
  text-align: center;
}

:deep(.ant-btn) {
  height: 40px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

:deep(.ant-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

:deep(.anticon) {
  font-size: 18px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .picture-detail {
    padding: 12px;
  }

  .content-layout {
    flex-direction: column;
  }

  .image-section,
  .info-section {
    flex: none;
    width: 100%;
  }

  .image-section {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }

  .title {
    font-size: 20px;
    margin-bottom: 16px;
    padding-bottom: 12px;
  }

  .info-card {
    padding: 12px;
  }

  .info-row {
    margin-bottom: 6px;
    gap: 8px;
  }

  .info-label {
    padding: 3px 8px;
    font-size: 12px;
    min-width: 70px;
  }

  .info-value {
    font-size: 13px;
  }

  .description {
    padding: 10px 12px;
  }

  .download-section {
    margin-top: 24px;
  }

  :deep(.ant-btn) {
    height: 36px;
    padding: 0 24px;
    font-size: 15px;
  }

  :deep(.anticon) {
    font-size: 16px;
  }
}

:deep(.preview-mask) {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

:deep(.preview-mask)::after {
  content: '点击查看大图';
}
</style>
