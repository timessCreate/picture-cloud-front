<template>
  <div class="home">
    <!-- 顶部横幅 -->
    <div class="banner">
      <div class="banner-content">
        <!-- 搜索框 -->
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
            <template v-if="selectedCategory">
              (分类: {{ selectedCategory }})
            </template>
            <template v-if="selectedTag">
              (标签: {{ selectedTag }})
            </template>
            <template v-if="searchText">
              (搜索: {{ searchText }})
            </template>
          </p>
          <div class="filter-actions">
            <a-button
              type="link"
              @click="clearSearch"
              v-if="searchText"
            >
              清除搜索
            </a-button>
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
                    maskClassName: 'preview-mask'
                  }"
                />
              </div>
              <div class="image-info">
                <h3 class="image-title">{{ item.name }}</h3>
                <p class="image-desc">{{ item.introduction || '暂无描述' }}</p>
                <div class="tags">
                  <a-tag v-for="tag in parseTags(item.tags)" :key="tag" color="blue">
                    {{ tag }}
                  </a-tag>
                </div>
                <div class="image-meta">
                  <span>{{ formatDate(item.createTime) }}</span>
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
import { listPictureVoByPageUsingPost, listPictureTagCategoryUsingGet } from '@/api/pictureController'
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

const filteredImages = computed(() => {
  let result = allImages.value

  // 先按分类筛选
  if (selectedCategory.value) {
    result = result.filter(image =>
      image.category === selectedCategory.value
    )
  }

  // 再按标签筛选
  if (selectedTag.value) {
    result = result.filter(image =>
      image.tags?.includes(selectedTag.value)
    )
  }

  // 最后按搜索词筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase().trim()
    result = result.filter(image =>
      image.name?.toLowerCase().includes(keyword) ||
      image.introduction?.toLowerCase().includes(keyword)
    )
  }

  return result
})

const total = computed(() => filteredImages.value.length)

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
      sortOrder: 'descend'
    })

    if (res.data.code === 0) {
      allImages.value = res.data.data.records || []
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
  return new Date(dateStr).toLocaleDateString()
}

const parseTags = (tags: string | undefined | null) => {
  if (!tags) return []
  return typeof tags === 'string' ? tags.split(',') : []
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
}

.banner {
  background: linear-gradient(120deg, #3498db, #2ecc71);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.banner-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
}

:deep(.ant-input-search) {
  border-radius: 24px;
  overflow: hidden;
}

:deep(.ant-input-search .ant-input) {
  height: 48px;
  font-size: 16px;
  padding-left: 20px;
}

:deep(.ant-input-search .ant-input-search-button) {
  height: 48px;
  width: 64px;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 0;
}

.image-item {
  break-inside: avoid;
}

.image-card {
  cursor: pointer;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.image-card:hover {
  transform: translateY(-4px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%;
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

.image-info {
  padding: 16px;
}

.image-title {
  margin: 0 0 8px;
  font-size: 1.1em;
  color: #333;
  font-weight: 600;
}

.image-desc {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.tags {
  margin-bottom: 12px;
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  transition: all 0.2s;
  margin: 0;
  font-size: 13px;
  padding: 4px 12px;
  height: auto;
  line-height: 1.4;
  border-radius: 4px;
}

.filter-tag:hover {
  opacity: 0.8;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
@media (max-width: 768px) {
  .waterfall {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .banner {
    min-height: 300px;  /* 减小移动端高度 */
    padding: 16px 16px 24px;
  }

  .banner h1 {
    font-size: 2em;
  }

  .carousel-container {
    width: 90%;  /* 移动端略微增加宽度占比 */
  }

  .carousel-item {
    height: 180px;  /* 减小移动端轮播图高度 */
  }

  .carousel-overlay h3 {
    font-size: 1em;
  }

  .carousel-overlay p {
    font-size: 0.8em;
  }

  .filter-container {
    flex-direction: column;
    align-items: stretch;
    padding: 8px 16px;
  }

  .filter-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .clear-button {
    margin-left: 0;
    margin-top: 8px;
    align-self: flex-end;
    font-size: 13px;
    height: 28px;
    padding: 3px 10px;
  }
}

/* 较小屏幕的额外调整 */
@media (max-width: 480px) {
  .banner {
    min-height: 260px;
  }

  .carousel-item {
    height: 150px;
  }

  .carousel-overlay {
    padding: 12px;
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
</style>
