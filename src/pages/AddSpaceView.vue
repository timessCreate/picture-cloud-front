<template>
  <div class="add-space-container">
    <a-card title="创建空间" class="elegant-card">
      <template #extra>
        <a-tag color="arcoblue" class="version-tag">
          <template #icon><star-outlined /></template>
          普通版
        </a-tag>
      </template>

      <div class="form-wrapper">
        <a-form layout="vertical" :model="formData" @finish="handleSubmit">
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
              提交创建
            </a-button>
          </a-form-item>
        </a-form>
        <a-card title="空间级别介绍" class="space-level-intro">
          <!-- 颜色加粗和下滑线 -->
          <a-typography-paragraph style="font-weight: bold; text-decoration: underline">
            *目前仅支持开通普通版空间
          </a-typography-paragraph>
          <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
            {{ spaceLevel.text }} : 存储空间 = {{ formatSize(spaceLevel.maxSize) }},图片数量限制<=
            {{ spaceLevel.maxCount }}
          </a-typography-paragraph>
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { addSpaceUsingPost, getSpaceLevelUsingGet } from '@/api/spaceController'
import { SPACE_LEVEL_OPTIONS, SPACE_LEVEL_MAP } from '@/constants/space'
import router from '@/router'
import { StarOutlined, FolderOpenOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'

const formData = reactive<API.SpaceAddRequest | API.SpaceUpdateRequest>({
  spaceName: '',
  spaceLevel: SPACE_LEVEL_OPTIONS[0].value,
})
//TODO: 需要从后端获取空间级别
const spaceLevelList = ref<API.SpaceLevel[]>([])
const loading = ref(false)

const formatSize = (size: number | undefined) => {
  if (!size) return '0MB'
  //当size大于1024*1024*1024时，转换为GB
  if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
  }
  //当size大于1024*1024时，转换为MB
  if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + 'MB'
  }
  //当size大于1000时，转换为KB
  if (size > 1000) {
    return (size / 1000).toFixed(2) + 'KB'
  }
  return size + 'B'
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
})

const handleSubmit = async (values: any) => {
  loading.value = true
  const res = await addSpaceUsingPost({
    ...formData,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建成功')
    router.push({
      path: `/space/${res.data.data}`,
    })
  } else {
    message.error('创建失败，' + res.data.message)
  }
  loading.value = false
}
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
    padding: 10px 20px;
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
