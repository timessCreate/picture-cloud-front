<template>
  <a-page-header title="智能分析" class="page-container">
    <a-card>
      <a-form :model="formState" :label-col="{ span: 4 }" @finish="handleSubmit">
        <a-form-item
          label="数据文件"
          name="file"
          :rules="[{ required: true, message: '请上传Excel文件' }]"
        >
          <a-upload
            :before-upload="
              (file: any) => {
                const ext = file.name
                  .toLowerCase()
                  .slice(Math.max(0, file.name.lastIndexOf('.')) || Infinity)
                const isValid = ['.xls', '.xlsx'].includes(ext)
                if (!isValid) {
                  message.error('文件扩展名必须为.xls或.xlsx')
                } else {
                  formState.file = file
                }
                return false
              }
            "
            :max-count="1"
            accept=".xls,.xlsx"
            :file-list="fileList"
            @change="handleFileChange"
          >
            <a-button>点击上传 Excel 文件</a-button>
            <div style="margin-top: 8px; color: #666">支持格式：.xls 或 .xlsx</div>
          </a-upload>
        </a-form-item>

        <a-form-item label="图表名称" name="name" :rules="[{ required: true }]">
          <a-input v-model:value="formState.name" placeholder="请输入图表名称" />
        </a-form-item>

        <a-form-item label="分析目标" name="goal" :rules="[{ required: true }]">
          <a-textarea v-model:value="formState.goal" placeholder="请输入你的分析需求" />
        </a-form-item>

        <a-form-item label="图表类型" name="chartType">
          <a-input v-model:value="formState.chartType" placeholder="可选，如：折线图" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4 }">
          <a-button type="primary" html-type="submit" :loading="loading"> 开始分析 </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card v-if="chartData" title="分析结果" style="margin-top: 24px">
      <div style="margin-bottom: 24px">
        <h3>分析结论</h3>
        <p>{{ chartData.genResult }}</p>
      </div>

      <div v-if="chartOption">
        <h3>数据可视化</h3>
        <v-chart :option="chartOption" :style="{ height: '500px' }" autoresize />
      </div>
    </a-card>

    <a-spin :spinning="loading" fullscreen />
  </a-page-header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { genChartByAiUsingPost } from '@/api/chartController'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

interface FormState {
  file?: File
  name: string
  goal: string
  chartType?: string
}

const formState = reactive<FormState>({
  name: '',
  goal: '',
  chartType: '',
})

const loading = ref(false)
const chartData = ref<API.AiResponse>()
const chartOption = ref<any>()
const fileList = ref<any[]>([])

const handleFileChange = (info: any) => {
  fileList.value = [info.file]
  if (info.file.status === 'done') {
    formState.file = info.file.originFileObj
  } else if (info.file.status === 'removed') {
    formState.file = undefined
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true

    if (!formState.file) {
      message.error('请先上传有效的Excel文件')
      return
    }

    const formData = new FormData()
    formData.append('file', formState.file)
    formData.append('name', formState.name)
    formData.append('goal', formState.goal)
    if (formState.chartType) {
      formData.append('chartType', formState.chartType)
    }

    const res = await genChartByAiUsingPost(formData)

    if (res.data) {
      chartData.value = res.data
      chartOption.value = JSON.parse(res.data?.genChart || '{}')
      message.success('分析成功')
    }
  } catch (error) {
    message.error('分析失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 24px;
}
</style>
