<template>
  <div class="add-picture-page-container">
    <a-card class="create-picture-card">
      <a-tabs v-model:activeKey="activeTab">
        <!-- 原有文件上传 -->
        <a-tab-pane key="file" tab="文件上传">
          <div id="addPicturePage">
            <div class="content-container">
              <div class="flex-layout">
                <div class="upload-section">
                  <PictureUpload :picture="picture" :onSuccess="localFileUpload.onSuccess" />
                </div>
                <a-form
                  v-if="picture"
                  layout="vertical"
                  :model="pictureForm"
                  @submit="handleSubmit"
                  class="form-container"
                >
                  <a-form-item label="名称" name="name">
                    <a-input v-model:value="pictureForm.name" placeholder="请输入名称" />
                  </a-form-item>
                  <a-form-item label="简介" name="introduction">
                    <a-textarea
                      v-model:value="pictureForm.introduction"
                      placeholder="请输入简介"
                      :rows="2"
                      autoSize
                      allowClear
                    />
                  </a-form-item>
                  <a-form-item label="分类" name="category">
                    <a-auto-complete
                      v-model:value="editForm.category"
                      placeholder="请输入分类"
                      :options="categoryOptions"
                      allowClear
                    />
                  </a-form-item>
                  <a-form-item label="标签" name="tags">
                    <a-select
                      v-model:value="editForm.tags"
                      mode="tags"
                      placeholder="请输入标签"
                      :options="tagOptions"
                      allowClear
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" html-type="submit" style="width: 100%">创建</a-button>
                  </a-form-item>
                </a-form>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- 新增URL上传 -->
        <a-tab-pane key="url" tab="URL上传">
          <a-card class="upload-card">
            <!-- 上传成功后的展示 -->
            <div v-if="urlUpload.url" class="preview-container">
              <!-- 左侧图片展示 -->
              <div class="image-preview">
                <a-image :src="urlUpload.result?.url" class="preview-image" :preview="false" />
              </div>

              <!-- 右侧编辑表单 -->
              <a-form class="edit-form" v-show="urlUpload.url" @submit="handleSubmit">
                <a-form-item label="图片名称">
                  <a-input v-model:value="editForm.name" />
                </a-form-item>
                <a-form-item label="分类" name="category">
                  <a-auto-complete
                    v-model:value="editForm.category"
                    placeholder="请输入分类"
                    :options="categoryOptions"
                    allowClear
                  />
                </a-form-item>
                <a-form-item label="标签" name="tags">
                  <a-select
                    v-model:value="editForm.tags"
                    mode="tags"
                    placeholder="输入标签"
                    :options="tagOptions"
                  />
                </a-form-item>
                <a-form-item label="简介" name="introduction">
                  <a-textarea v-model:value="editForm.introduction" :rows="4" />
                </a-form-item>
                <a-button type="primary" html-type="submit">保存修改</a-button>
              </a-form>
            </div>

            <!-- 上传表单（未上传时显示） -->
            <div v-else class="upload-form">
              <a-input v-model:value="urlUpload.url" placeholder="输入图片URL" class="url-input" />
              <a-button type="primary" :loading="urlUpload.loading" @click="handleUrlUpload">
                立即上传
              </a-button>
            </div>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
  uploadPictureByUrlUsingPost,
} from '@/api/pictureController'
import PictureUpload from '@/components/PictureUpload.vue'
import { message } from 'ant-design-vue'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const pictureForm = reactive<API.PictureEditRequest>({})
const picture = ref<API.PictureVO>()

// 本地图片上传逻辑参考
const localFileUpload = {
  file: ref<File>(),
  onSuccess: (data: API.PictureVO) => {
    // 本地文件上传成功处理
    picture.value = data
  },
}

// URL上传对应实现
const urlUpload = reactive({
  url: '',
  loading: false,
  result: null as API.PictureVO | null,

  // 对应本地上传的onSuccess
  onSuccess: (data: API.PictureVO) => {
    urlUpload.result = data
    // 同步到主表单
    Object.assign(pictureForm, {
      name: data.name,
      introduction: data.introduction,
      category: data.category,
      tags: data.tags || [],
    })
  },
})

const handleUrlUpload = async () => {
  try {
    urlUpload.loading = true
    const { data } = await uploadPictureByUrlUsingPost({
      pictureUrl: urlUpload.url,
    })
    if (data.code === 0 && data.data) {
      urlUpload.onSuccess(data.data)
      message.success('URL上传成功')
    } else {
      message.error(data.message)
    }
  } finally {
    urlUpload.loading = false
  }
}

// 统一提交处理（与本地上传共用）
const handleSubmit = async () => {
  const params: API.PictureEditRequest = {
    ...editForm,
    // 统一处理ID来源
    id: picture.value?.id || urlUpload.result?.id,
  }

  if (!params.id) {
    message.error('请先上传图片')
    return
  }

  try {
    const res = await editPictureUsingPost(params)
    if (res.data.code === 0) {
      message.success('信息保存成功')
      picture.value = null
      urlUpload.url = ''
    }
  } catch (error) {
    message.error('保存失败')
  }
}

const router = useRouter()

/**
 * 获取标签和分类选项
 * @param values
 */
// const categoryOptions = ref<string[]>([])
// const tagOptions = ref<string[]>([])
const tagOptions = ref<Array<{ value: string; label: string }>>([])
const categoryOptions = ref<Array<{ value: string; label: string }>>([])
// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => ({
      value: data,
      label: data,
    }))
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => ({
      value: data,
      label: data,
    }))
  } else {
    message.error('加载选项失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

const route = useRoute()
//获取上传的图片信息
const getOldPicture = async () => {
  //获取图片id
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}
//用户上传照片后，首次加载更新图片信息表单时加载
onMounted(() => {
  getOldPicture()
})

// 状态管理
const activeTab = ref<'file' | 'url'>('file')
const isEditing = ref(false)

// 编辑阶段状态
const editForm = reactive({
  id: undefined as number | undefined,
  name: '',
  category: '',
  tags: [] as string[],
  introduction: '',
})

// 编辑提交
const handleEditSubmit = async () => {
  if (!editForm.id) return

  try {
    const params: API.PictureEditRequest = {
      id: editForm.id,
      name: editForm.name,
      category: editForm.category,
      tags: editForm.tags.join(','),
      introduction: editForm.introduction,
    }

    const { data } = await editPictureUsingPost(params)
    if (data.code === 0) {
      message.success('修改成功')
    }
  } catch (error) {
    message.error('修改失败')
  }
}
</script>

<style scoped>
#addPicturePage {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  height: 100%;
  width: 100%;
}

.content-container {
  max-width: 1200px; /* 增大容器宽度 */
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  padding-top: 20px; /* 补偿移除标题后的间距 */
}

.flex-layout {
  display: flex;
  gap: 60px; /* 增加间距 */
  justify-content: center; /* 居中布局 */
}

.upload-section {
  flex: 0 1 500px; /* 增大上传区域宽度 */
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.form-container {
  flex: 0 1 600px; /* 增大表单区域宽度 */
}

.create-picture-card {
  background: transparent;
  border: none;
  box-shadow: none;
}

:deep(.ant-tabs-nav) {
  /* margin: 0 0 30px 0; */
}

:deep(.ant-tabs-tab) {
  font-size: 16px;
  /* padding: 12px 24px; */
}

:deep(.ant-tabs-tab-active) {
  font-weight: 600;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
}

@media (max-width: 992px) {
  .content-container {
    max-width: 100%;
    padding: 20px;
  }

  .flex-layout {
    flex-direction: column;
    gap: 30px;
  }

  .upload-section,
  .form-container {
    flex: 1 1 100%;
  }
}

.upload-card {
  max-width: 1200px;
  /* margin: 20px auto; */
}

.preview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  height: 80vh; /* 使用视窗比例控制高度 */
  min-height: 500px; /* 最小高度保障 */
  max-height: 1000px; /* 最大高度限制 */
}

.image-preview {
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-image {
  max-height: calc(100% - 60px); /* 为操作按钮留出空间 */
}

.image-actions {
  height: 60px;
  flex-shrink: 0;
}

.edit-form {
  height: 100%;
  overflow-y: auto;
}

.upload-form {
  display: flex;
  gap: 16px;
  padding: 40px 0;
  justify-content: center;
}

.url-input {
  width: 500px;
}

@media (max-width: 768px) {
  .preview-container {
    height: auto;
    min-height: unset;
    grid-template-rows: 70vh auto;
  }

  .preview-image {
    max-height: 100%;
  }

  .content-container {
    padding-top: 12px;
  }
}
</style>
