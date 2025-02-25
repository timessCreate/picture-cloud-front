// 定义状态映射的类型
interface ReviewStatusMap {
  [key: string]: string;  // 允许字符串索引
}

export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
} as const

export const PIC_REVIEW_STATUS_MAP: ReviewStatusMap = {
  '0': '待审核',
  '1': '通过',
  '2': '拒绝',
}

export const PIC_REVIEW_STATUS_OPTIONS = Object.keys(PIC_REVIEW_STATUS_MAP).map((key) => {
  return {
    label: PIC_REVIEW_STATUS_MAP[key],
    value: key,
  }
})
