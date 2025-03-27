<template>
  <div class="home">
    <!-- 顶部横幅 -->
    <div class="banner">
      <div class="banner-content">
        <div class="search-container">
          <a-input-search
            v-model:value="searchText"
            placeholder="搜索图片名称或简介..."
            enter-button
            size="large"
            @search="handleSearch"
            @change="handleSearchChange"
            allow-clear
          >
            <template #prefix>
              <search-outlined />
            </template>
          </a-input-search>
        </div>
      </div>
    </div>

    <!-- 分类栏 -->
    <div class="filter-container category-container">
      <div class="filter-content">
        <div class="filter-label">分类：</div>
        <div class="filter-wrapper">
          <a-tag
            v-for="category in allCategories"
            :key="category"
            :color="selectedCategory === category ? '#1890ff' : undefined"
            class="filter-tag"
            @click="handleCategoryClick(category)"
          >
            {{ category }}
          </a-tag>
        </div>
      </div>
      <a-button
        v-if="selectedCategory"
        @click="selectedCategory = ''"
        class="clear-button"
        type="primary"
        ghost
      >
        <template #icon><close-outlined /></template>
        清除分类
      </a-button>
    </div>

    <!-- 标签栏 -->
    <div class="filter-container tag-container">
      <div class="filter-content">
        <div class="filter-label">标签：</div>
        <div class="filter-wrapper">
          <a-tag
            v-for="tag in allTags"
            :key="tag"
            :color="selectedTag === tag ? '#1890ff' : undefined"
            class="filter-tag"
            @click="handleTagClick(tag)"
          >
            {{ tag }}
          </a-tag>
        </div>
      </div>
      <a-button
        v-if="selectedTag"
        @click="selectedTag = ''"
        class="clear-button"
        type="primary"
        ghost
      >
        <template #icon><close-outlined /></template>
        清除标签
      </a-button>
    </div>

    <!-- 图片展示区域 -->
    <div class="container">
      <a-spin :spinning="loading">
        <!-- 搜索和筛选结果提示 -->
        <div class="search-result" v-if="searchText || selectedTag || selectedCategory">
          <p>
            {{ total }} 张图片
            <template v-if="selectedCategory"> (分类: {{ selectedCategory }}) </template>
            <template v-if="selectedTag"> (标签: {{ selectedTag }}) </template>
            <template v-if="searchText"> (搜索: {{ searchText }}) </template>
          </p>
          <div class="filter-actions">
            <a-button type="link" @click="clearSearch" v-if="searchText"> 清除搜索 </a-button>
          </div>
        </div>

        <!-- 瀑布流布局 -->
        <div class="waterfall">
          <div v-for="item in filteredImages" :key="item.id" class="image-item">
            <div class="image-card" @click="handleImageClick(item)">
              <div class="image-wrapper">
                <a-image
                  :src="item.url"
                  :preview="{
                    src: item.url,
                    maskClassName: 'preview-mask',
                  }"
                />
              </div>
              <div class="image-info">
                <h3 class="image-title">{{ item.name }}</h3>
                <p class="image-desc" v-if="item.introduction">{{ item.introduction }}</p>
                <div class="tags">
                  <a-tag v-for="tag in item.tags" :key="tag" color="blue">
                    {{ tag }}
                  </a-tag>
                </div>
                <div class="image-meta">
                  <span v-if="formatDate(item.createTime)">{{ formatDate(item.createTime) }}</span>
                  <span class="category">{{ item.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页器 -->
        <div class="pagination">
          <a-pagination
            v-model:current="current"
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import {
  listPictureVoByPageUsingPost,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController'
import type { PictureVO } from '@/api/typings'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const current = ref(1)
const pageSize = ref(12)
const allImages = ref<PictureVO[]>([])
const searchText = ref('')
const searchTimeout = ref<number | null>(null)
const selectedTag = ref('')
const allTags = ref<string[]>([])
const selectedCategory = ref('')
const allCategories = ref<string[]>([])
const total = ref<number | null>(null)

const filteredImages = computed(() => {
  let result = allImages.value

  // 先按分类筛选
  if (selectedCategory.value) {
    result = result.filter((image: PictureVO) => image.category === selectedCategory.value)
  }

  // 再按标签筛选
  if (selectedTag.value) {
    result = result.filter((image: PictureVO) => image.tags?.includes(selectedTag.value))
  }

  // 最后按搜索词筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase().trim()
    result = result.filter(
      (image: PictureVO) =>
        image.name?.toLowerCase().includes(keyword) ||
        image.introduction?.toLowerCase().includes(keyword),
    )
  }
  return result
})

const handleSearch = () => {
  current.value = 1
}

const handleSearchChange = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    handleSearch()
  }, 300) as unknown as number
}

const clearSearch = () => {
  searchText.value = ''
  handleSearch()
}

const fetchImages = async () => {
  loading.value = true
  try {
    const res = await listPictureVoByPageUsingPost({
      current: current.value,
      pageSize: pageSize.value,
      sortField: 'createTime',
      sortOrder: 'descend',
    })

    if (res.data.code === 0 && res.data.data) {
      allImages.value = res.data.data.records || []
      total.value = Number(res.data.data.total)

      if (searchText.value && filteredImages.value.length === 0) {
        message.info('未找到相关图片')
      }
    } else {
      message.error('获取图片列表失败：' + res.data.message)
    }
  } catch (error) {
    console.error('获取图片列表出错：', error)
    message.error('获取图片列表失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  current.value = page
  fetchImages()
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

const formattedDate = (dateStr: string | null) => {
  if (dateStr) {
    return formatDate(dateStr)
  }
  return null
}

const fetchCategoriesAndTags = async () => {
  try {
    const res = await listPictureTagCategoryUsingGet()
    if (res.data.code === 0 && res.data.data) {
      allTags.value = res.data.data.tagList || []
      allCategories.value = res.data.data.categoryList || []
    }
  } catch (error) {
    console.error('获取分类和标签失败：', error)
  }
}

const handleTagClick = (tag: string) => {
  if (selectedTag.value === tag) {
    selectedTag.value = ''
  } else {
    selectedTag.value = tag
  }
}

const handleCategoryClick = (category: string) => {
  if (selectedCategory.value === category) {
    selectedCategory.value = ''
  } else {
    selectedCategory.value = category
  }
}

const handleImageClick = (item: PictureVO) => {
  router.push({
    path: `/picture/${item.id}`,
  })
}

onMounted(() => {
  fetchCategoriesAndTags()
  fetchImages()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f0f2f5;
  overflow: visible;
}

.banner {
  position: relative;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  padding: 40px 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 0;
  overflow: hidden;
  padding-bottom: 63px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.banner-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.search-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 16px;
}

:deep(.ant-input-search) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
}

:deep(.ant-input-search .ant-input) {
  background: transparent;
  color: black;
  padding-left: 28px;
}

:deep(.ant-input-search .ant-input::placeholder) {
  color: rgba(0, 0, 0, 0.8);
}

:deep(.ant-input-search .ant-input-search-button) {
  background: rgba(255, 255, 255, 0.15) !important;
  border-left-color: rgba(255, 255, 255, 0.2) !important;
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
}

.search-result {
  padding: 12px 16px;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-result p {
  margin: 0;
  color: #666;
}

.waterfall {
  display: grid;
  grid-template-columns: repeat(4, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  break-inside: avoid;
}

.image-card {
  cursor: pointer;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
}

.image-wrapper :deep(.ant-image) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.image-wrapper :deep(.ant-image-img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-wrapper:hover :deep(.ant-image-img) {
  transform: scale(1.05);
}

.image-info {
  padding: 16px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 30%);
}

.image-title {
  margin: 0 0 6px;
  font-size: 15px;
  color: #1f2937;
  font-weight: 600;
}

.image-desc {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  margin: 10px -4px;
}

.tags :deep(.ant-tag) {
  margin: 4px;
  border-radius: 6px;
  background: #f3f4f6;
  border-color: transparent;
  color: #4b5563;
  font-size: 12px;
  padding: 0 8px;
  line-height: 22px;
}

.image-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 0.85em;
}

.category {
  color: #1890ff;
}

.pagination {
  text-align: center;
  margin: 32px 0;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -35px;
  margin-bottom: 15px;
  border: 1px solid rgba(209, 213, 219, 0.3);
}

.filter-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-right: 16px;
  white-space: nowrap;
}

.filter-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.filter-tag {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  border: 1px solid transparent;
  margin: 0;
  font-size: 13px;
  padding: 4px 12px;
  height: auto;
  line-height: 1.4;
}

.filter-tag[style*='#1890ff'] {
  border-color: rgba(24, 144, 255, 0.2);
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.clear-button {
  padding: 4px 12px;
  margin-left: 16px;
  height: 32px;
  font-size: 14px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #fff;
  border-color: #ff4d4f;
  color: #ff4d4f;
  transition: all 0.3s;
}

.clear-button:hover {
  color: #fff;
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

.clear-button :deep(.anticon) {
  font-size: 12px;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .waterfall {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .waterfall {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    gap: 12px;
  }

  .image-wrapper {
    padding-top: 75%;
  }

  .banner {
    padding: 28px 16px;
    padding-bottom: 30px;
  }

  .filter-container {
    margin-top: -30px;
    padding: 12px 16px;
  }

  .image-title {
    font-size: 14px;
  }

  .image-desc {
    -webkit-line-clamp: 2;
  }

  .snake-character {
    right: -30px;
    height: 200px;
    opacity: 0.8;
  }
}

@media (max-width: 480px) {
  .waterfall {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    gap: 8px;
  }
}

/* 添加预览遮罩层样式 */
:deep(.preview-mask) {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

:deep(.preview-mask)::after {
  content: '点击预览';
}

.snake-character {
  position: absolute;
  right: 10%;
  bottom: -30px;
  height: 280px;
  z-index: 10;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}
</style>
