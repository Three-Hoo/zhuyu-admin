import { PageCreateor } from '@/core/create-page'
import { ProSchema } from '@ant-design/pro-components'
import { FormInstance } from 'antd'
import { RuleObject } from 'antd/es/form'
import axios from 'axios'
import React, { CSSProperties } from 'react'

export type ProFormListParams = [ProSchema, unknown, FormInstance]

type CommonProps = {
  api?: string
  defaultRecord?: Record<string, unknown>
  params: ProFormListParams
  required?: boolean
}

const requiredRule = {
  required: true,
  message: '至少要有一项！',
  validator: async (_: RuleObject, value: unknown[]) => {
    if (value && value.length > 0) {
      return
    }
    throw new Error('至少要有一项！')
  },
}

export const useProFormListCommonProps = (props: CommonProps) => {
  const [schema, _config, form] = props.params
  const name = schema.dataIndex ?? Reflect.get(schema, 'name')
  const value = form.getFieldValue(name)
  const api = props.api ?? form.getFieldValue('api')

  return {
    name: schema.dataIndex ?? Reflect.get(schema, 'name'),
    initialValue: value,
    creatorButtonProps: {
      creatorButtonText: `增加${schema.title || Reflect.get(schema, 'label')}`,
      position: 'bottom',
      type: 'primary',
      ghost: true,
    } as const,
    containerStyle: { display: 'flex', flexWrap: 'wrap', width: '70vw' } as CSSProperties,
    alwaysShowItemLabel: true,
    rules: props.required !== false ? [requiredRule] : [],
    creatorRecord: () => ({ ...props.defaultRecord }),
    onAfterRemove: async (index: number | number[], _: number) => {
      const removeedReminder = value[index as number]
      if (removeedReminder?.id) {
        await axios.delete(`${api}?id=${removeedReminder.id}`)
      }
    },
  }
}

export const createProFormList = <T extends { params: ProFormListParams }>(Component: React.FunctionComponent<T>) => {
  // eslint-disable-next-line react/display-name
  return (...params: unknown[]) => {
    // @ts-ignore
    return <Component params={params as ProFormListParams} render={Math.random()} />
  }
}

export const useParseProFormListParams = (props: { params: ProFormListParams }) => {
  const fieldValues = props.params[2].getFieldsValue(props.params[0].dependencies ?? [])

  return { fieldValues }
}

export const showColumnInTableWithIdColumn = (
  namePath: string[],
  column: PageCreateor['columns'][number],
  customColumn?: PageCreateor['columns'][number]
) => {
  return [
    {
      ...column,
      hideInTable: true,
    },
    {
      ...column,
      hideInForm: true,
      hideInSearch: true,
      hideInTable: false,
      renderFormItem: undefined,
      request: undefined,
      required: false,
      name: namePath,
      dataIndex: namePath,
      ...customColumn,
    },
  ] as PageCreateor['columns']
}
