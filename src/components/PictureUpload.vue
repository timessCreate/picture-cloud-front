<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或者拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/pictureController'

interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()
/**
 * 上传图片
 * @param file
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params = props.picture ? { id: props.picture.id } : {}
    //响应数据
    const res = await uploadPictureUsingPost(params, {}, file)
    console.log(res)
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      //将上传成功的信息传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败 ' + res.data.message)
    }
    loading.value = false
  } catch (error) {
    message.error('图片上传失败' + error)
  }
  //无论成功与否，都设置loading为false,标识上传结束
  loading.value = false
}

const loading = ref<boolean>(false)

/**
 * 上传前校验
 * @param file
 */
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持的图片格式，推荐jpg/png!')
  }
  // 图片大小校验
  const isLt2M = file.size / 1024 / 1024 < 3
  if (!isLt2M) {
    message.error('图片大小不能超过3M!')
  }
  return isJpgOrPng && isLt2M
}
</script>

<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 400px !important; /* 设置宽度 */
  height: 400px !important; /* 设置相同的高度，保持1:1比例 */
  margin: 0 auto;
  padding: 8px;
  box-sizing: border-box;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.picture-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.anticon) {
  font-size: 32px;
  color: #999;
}

.ant-upload-text {
  margin-top: 8px;
  font-size: 16px;
  color: #666;
}
</style>
