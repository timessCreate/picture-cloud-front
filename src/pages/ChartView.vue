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
          <a-select
            v-model:value="formState.chartType"
            placeholder="请选择图表类型"
            show-search
            option-filter-prop="label"
          >
            <a-select-option
              v-for="type in chartTypes"
              :key="type.value"
              :value="type.value"
              :label="type.label"
            >
              {{ type.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4 }">
          <a-button type="primary" html-type="submit" :loading="loading"> 开始分析 </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card v-if="chartData" title="分析结果" style="margin-top: 24px">
      <div style="margin-bottom: 24px; position: relative">
        <h3>分析结论</h3>
        <div style="position: absolute; right: 20px; top: 0">
          <a-button @click="exportChartData">导出图表JSON数据</a-button>
          <a-button type="primary" @click="handleSaveImage" style="margin-left: 8px">
            保存为图片
          </a-button>
        </div>
        <pre style="white-space: pre-wrap">{{ chartData.genResult }}</pre>
      </div>

      <div v-if="chartOption">
        <h3>数据可视化</h3>
        <v-chart ref="chartRef" :option="chartOption" :style="{ height: '350px' }" autoresize />
      </div>
    </a-card>

    <a-spin :spinning="loading" fullscreen />

    <a-modal
      v-model:visible="showSaveOption"
      title="选择保存方式"
      :footer="null"
      :closable="false"
      centered
    >
      <div style="display: flex; gap: 16px; justify-content: center">
        <a-button type="primary" @click="exportAsImage">保存到本地</a-button>
        <a-button :loading="uploadLoading" @click="uploadToPersonalSpace">上传到个人空间</a-button>
        <a-button @click="showSaveOption = false">取消</a-button>
      </div>
    </a-modal>
  </a-page-header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { genChartByAiUsingPost } from '@/api/chartController'
import { uploadPictureUsingPost } from '@/api/pictureController'
import { use } from 'echarts/core'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { ECharts } from 'echarts'

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

// 图表类型选项
const chartTypes = ref([
  { value: 'line', label: '折线图' },
  { value: 'bar', label: '柱状图' },
  { value: 'pie', label: '饼图' },
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
  file: undefined,
})

const loading = ref(false)
const chartData = ref<API.AiResponse>()
const chartOption = ref<any>()
const fileList = ref<any[]>([])
const chartRef = ref<{ chart: ECharts }>()
const showSaveOption = ref(false)
const uploadLoading = ref(false)
const loginUser = useLoginUserStore()
const uploadPictureParams = ref<API.uploadPictureUsingPOSTParams>

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

    // 构造符合接口要求的参数
    const requestParams = {
      name: formState.name,
      goal: formState.goal,
      chartType: formState.chartType,
    }

    const res = await genChartByAiUsingPost(
      requestParams, // 第一个参数对应普通参数
      {}, // 第二个参数对应body
      formState.file, // 第二个参数对应文件
    )
    console.log(res)
    if (res.data.code === 0 && res.data.data) {
      chartData.value = res.data.data
      console.log(res.data.data)
      chartOption.value = { ...JSON.parse(res.data.data?.genChart || '{}') }
      console.log(chartOption.value)
      message.success('分析成功')
    }
  } catch (error) {
    message.error('分析失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleSaveImage = () => {
  showSaveOption.value = true
}

const uploadToPersonalSpace = async () => {
  try {
    uploadLoading.value = true
    if (chartRef.value?.chart) {
      const chartInstance = chartRef.value.chart
      const dataURL = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
      })

      // 生成文件对象
      const blob = await fetch(dataURL).then((res) => res.blob())
      const file = new File([blob], `${formState.name || 'chart'}_${Date.now()}.png`, {
        type: 'image/png',
      })

      if (!loginUser.currentSpaceId) {
        message.error('当前用户没有空间，请先创建空间')
        return
      }
      // 调用图片上传接口
      const res = await uploadPictureUsingPost(
        {
          spaceId: loginUser.currentSpaceId,
        }, // params参数
        {}, // body参数
        file,
      )

      if (res.data.data?.code === 0) {
        message.success('上传到个人空间成功')
      } else {
        message.error(res.data.data?.message || '上传失败')
      }
    }
  } catch (error) {
    message.error('上传失败')
  } finally {
    uploadLoading.value = false
    showSaveOption.value = false
  }
}

const exportAsImage = () => {
  if (chartRef.value?.chart) {
    const chartInstance = chartRef.value.chart
    const dataURL = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff',
    })

    const link = document.createElement('a')
    link.download = `${formState.name || 'chart'}_${Date.now()}.png`
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const exportChartData = () => {
  if (chartData.value) {
    const dataStr = JSON.stringify(
      {
        config: chartOption.value,
        conclusion: chartData.value.genResult,
      },
      null,
      2,
    )

    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.download = `${formState.name || 'chart'}_${Date.now()}.json`
    link.href = url
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 0)
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 24px;
}

.ant-btn {
  margin-left: 8px;
}
</style>
