// 空间级别枚举值
export const SPACE_LEVEL = {
  COMMON: 0,
  PROFESSIONAL: 1,
  FLAGSHIP: 2
} as const;

// 数值到中文的映射
export const SPACE_LEVEL_MAP: Record<number, string> = {
  [SPACE_LEVEL.COMMON]: '普通版',
  [SPACE_LEVEL.PROFESSIONAL]: '专业版',
  [SPACE_LEVEL.FLAGSHIP]: '旗舰版'
} as const;

// 用于选择器的选项
export const SPACE_LEVEL_OPTIONS = [
  { label: '普通版', value: SPACE_LEVEL.COMMON },
  { label: '专业版', value: SPACE_LEVEL.PROFESSIONAL },
  { label: '旗舰版', value: SPACE_LEVEL.FLAGSHIP }
] as const;

// 类型定义
export type SpaceLevel = keyof typeof SPACE_LEVEL;
export type SpaceLevelValue = typeof SPACE_LEVEL[SpaceLevel];
