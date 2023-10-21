export const getCommonStatus = (disabled?: string, enabled?: string) => {
  return {
    DISABLED: {
      text: disabled ?? '禁用',
      status: 'Error',
    },
    ENABLED: {
      text: enabled ?? '启用',
      status: 'Success',
    },
  }
}

export const COMMON_STATUS = getCommonStatus()
