<template>
  <div class="add-space-container">
    <a-card title="修改空间" class="elegant-card">
      <div class="form-wrapper">
        <a-form layout="vertical" :model="formData" @finish="handleSubmit">
          <!-- 空间名称组件 -->
          <a-form-item label="空间名称" name="spaceName">
            <a-input
              v-model:value="formData.spaceName"
              placeholder="请输入空间名称"
              class="elegant-input"
            >
              <template #prefix>
                <folder-open-outlined style="color: #86909c" />
              </template>
            </a-input>
          </a-form-item>
          <!-- 空间最大存储空间组件 -->
          <a-form-item label="空间最大存储空间(单位:MB)" name="maxSize">
            <a-input
              v-model:value="formData.maxSize"
              class="elegant-input"
              placeholder="请输入空间最大存储空间"
            />
            <template #prefix>
              <folder-open-outlined style="color: #86909c" />
            </template>
          </a-form-item>
          <!-- 空间最大图片数量组件 -->
          <a-form-item label="空间最大图片数量(单位:张)" name="maxCount">
            <a-input
              v-model:value="formData.maxCount"
              class="elegant-input"
              placeholder="请输入空间最大图片数量"
            />
            <template #prefix>
              <folder-open-outlined style="color: #86909c" />
            </template>
          </a-form-item>
          <a-form-item label="空间级别" name="spaceLevel">
            <a-select
              v-model:value="formData.spaceLevel"
              :options="SPACE_LEVEL_OPTIONS"
              placeholder="请输入空间级别"
              style="min-width: 180px"
              allow-clear
            />
          </a-form-item>
          <a-form-item class="action-buttons">
            <a-button type="primary" html-type="submit" class="submit-button" :loading="loading">
              <template #icon><check-circle-outlined /></template>
              提交修改
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  addSpaceUsingPost,
  getSpaceLevelUsingGet,
  getSpaceVoByIdUsingGet,
  updateSpaceUsingPost,
} from '@/api/spaceController'
import { SPACE_LEVEL_OPTIONS, SPACE_LEVEL_MAP } from '@/constants/space'
import router from '@/router'
import { StarOutlined, FolderOpenOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'

const formData = reactive<API.SpaceUpdateRequest>({
  spaceName: '',
  spaceLevel: SPACE_LEVEL_OPTIONS[0].value,
})

const spaceLevelList = ref<API.SpaceLevel[]>([])
const loading = ref(false)
const route = useRoute()
const oldSpace = ref<API.Space>()

//获取旧的space信息
const fetchOldSpace = async () => {
  //获取被更改的spaceId
  const spaceId = route.params.id as string
  const res = await getSpaceVoByIdUsingGet({ id: spaceId })

  if (res.data.code === 0 && res.data.data) {
    oldSpace.value = res.data.data
    formData.spaceName = res.data.data.spaceName
    formData.spaceLevel = res.data.data.spaceLevel
    //显示为MB  计算为MB
    formData.maxSize = res.data.data?.maxSize ? res.data.data.maxSize / 1024 / 1024 : 0
    //显示为张
    formData.maxCount = res.data.data?.maxCount ? res.data.data.maxCount : 0
  }
}
//获取空间级别
const fetchSpaceLevelList = async () => {
  const res = await getSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('获取空间级别失败，' + res.data.message)
  }
}
onMounted(() => {
  fetchSpaceLevelList()
  fetchOldSpace()
})

const handleSubmit = async (values: API.SpaceUpdateRequest) => {
  loading.value = true
  const res = await updateSpaceUsingPost({
    ...formData,
    //将MB转换为B
    id: oldSpace.value?.id,
    maxSize: formData.maxSize ? formData.maxSize * 1024 * 1024 : 0,
    maxCount: formData.maxCount ? formData.maxCount : 0,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('修改成功')
  } else {
    message.error('修改失败，' + res.data.message)
  }
  loading.value = false
}

defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<style scoped lang="less">
.add-space-container {
  max-width: 100%;

  padding: 0;

  .elegant-card {
    margin: 0 auto;

    :deep(.ant-card-head) {
      border-bottom: none;
      padding: 24px;

      .ant-card-head-title {
        font-size: 20px;
        font-weight: 600;
        color: #1d2129;
      }
    }

    .version-tag {
      border-radius: 16px;
      padding: 4px 12px;
      font-size: 14px;
      border: 1px solid #e5e6eb;
      background: rgba(22, 93, 255, 0.1);
    }
  }

  .form-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1px 20px;
  }

  .space-level-intro {
    margin: 0 auto;
    width: 80%;
    margin-top: 10px;
  }

  .ant-form,
  .ant-card {
    width: 100%;
  }

  .ant-form-item :deep(.ant-input),
  .ant-form-item :deep(.ant-select) {
    width: 100%;
  }

  .action-buttons {
    text-align: center;
  }

  .elegant-input {
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);

    &:hover {
      border-color: #165dff;
      box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.1);
    }

    :deep(.ant-input-prefix) {
      margin-right: 8px;
    }
  }

  .action-buttons {
    margin-top: 32px;

    .submit-button {
      height: 44px;
      width: 100%;
      border-radius: 8px;
      font-size: 16px;
      background: linear-gradient(135deg, #165dff, #1d39c4);
      border: none;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>
