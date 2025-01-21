<template>
 <div id="addPicturePage">
  <h2 style="margin-bottom: 16px">
    {{route.query?.id ? '修改图片' : '创建图片'}}
  </h2>
  <div class="content-container">
    <div class="flex-layout">
      <div class="upload-section">
        <PictureUpload :picture="picture" :onSuccess="onSuccess" />
      </div>
      <a-form v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit" class="form-container">
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
            v-model:value="pictureForm.category"
            placeholder="请输入分类"
            :options="categoryOptions"
            allowClear
          />
        </a-form-item>
        <a-form-item label="标签" name="tags">
          <a-select
            v-model:value="pictureForm.tags"
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

</template>

<script setup lang="ts">
import { editPictureUsingPost, getPictureVoByIdUsingGet, listPictureTagCategoryUsingGet } from '@/api/pictureController'
import PictureUpload from '@/components/PictureUpload.vue'
import { message } from 'ant-design-vue'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const pictureForm = reactive<API.PictureEditRequest>({})
const picture = ref<API.PictureVO>()
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

const router = useRouter()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  const pictureId = picture?.value?.id
  if (!pictureId) {
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values,
  })
  if (res.data.code === 0 && res.data) {
    message.success('创建成功')
    // 跳转到图片详情页
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败，' + res.data.message)
  }
}

/**
 * 获取标签和分类选项
 * @param values
 */
// const categoryOptions = ref<string[]>([])
// const tagOptions = ref<string[]>([])
const tagOptions = ref<Array<{ value: string; label: string }>>([]);
const categoryOptions = ref<Array<{ value: string; label: string }>>([]);
// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => ({
        value: data,
        label: data,
    }));
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => ({
        value: data,
        label: data,
    }));
  } else {
    message.error('加载选项失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

const route = useRoute();
//获取上传的图片信息
const getOldPicture = async()=>{
  //获取图片id
  const id = route.query?.id
  if(id){
    const res = await getPictureVoByIdUsingGet({
      id
    })
    if(res.data.code === 0 && res.data.data){
      const data = res.data.data;
      picture.value = data;
      pictureForm.name = data.name;
      pictureForm.introduction = data.introduction;
      pictureForm.category = data.category;
      pictureForm.tags = data.tags;
    }
  }
}
//用户上传照片后，首次加载更新图片信息表单时加载
onMounted(() => {
  getOldPicture();
})
</script>

<style scoped>
#addPicturePage {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.content-container {
  width: 100%;
  max-width: 1000px;  /* 减小整体最大宽度 */
  margin: 0 auto;
}

.flex-layout {
  display: flex;
  gap: 40px;          /* 增加间距 */
  align-items: flex-start;
}

.upload-section {
  flex: 0 0 400px;    /* 固定上传区域宽度为400px */
  margin-right: 20px;
}

.form-container {
  flex: 0 0 400px;    /* 固定表单宽度为400px */
  min-width: 0;
}

:deep(.ant-form-item) {
  width: 100%;
  margin-bottom: 16px;
}

:deep(.ant-input),
:deep(.ant-input-textarea),
:deep(.ant-select),
:deep(.ant-auto-complete) {
  width: 100%;
}

/* 响应式布局 */
@media (max-width: 900px) {
  .flex-layout {
    flex-direction: column;
  }

  .upload-section,
  .form-container {
    flex: 0 0 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
}
</style>
