import Layout from '@/component/layout'
import axios from 'axios'
import {
  ActionType,
  BetaSchemaForm,
  PageContainer,
  ProColumns,
  ProCoreActionType,
  ProFormColumnsType,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Drawer, Popconfirm, Spin, UploadProps, notification } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { last, merge } from 'lodash'
import useSWR from 'swr'

import { useIsClient } from '@uidotdev/usehooks'
import { useMemoizedFn } from 'ahooks/lib'
import { getSTSAuthorization, uploadFile } from '@/utils/web-sts'
import { Rule } from 'antd/lib/form'

export type PageCreateor = {
  title?: string
  hideOption?: boolean
  renderDetail?: (record: Record<any, any>) => ReactNode
  renderToolbar?: (action?: ActionType) => ReactNode[]
  columns: (ProColumns &
    ProFormColumnsType & {
      disabledInEdit?: boolean
      rules?: Rule[]
      required?: boolean
      apiValue?: (value: unknown) => unknown
    })[]
  api: string
}

export const convertionApiValue = (values: any, columns: PageCreateor['columns']) => {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      if (key === 'id') {
        return [key, Number(value)]
      }
      return [key, columns.find((item) => item.name === key || item.dataIndex === key)?.apiValue?.(value) ?? value]
    })
  )
}

export const createPage = (options: PageCreateor) => {
  const Page = () => {
    const ref = useRef<ActionType>()
    const client = useIsClient()
    const [visibleMutation, updateVisibleMutation] = useState(false)
    const [visibleDescription, updateVisibleDescription] = useState(false)
    const [mutableId, setMutableId] = useState<string>()

    const isPaused = useMemoizedFn(() => !mutableId)

    const { data, isLoading } = useSWR(
      '/api/achievement?id=' + mutableId,
      (url) => axios.get(url).then((res) => res.data),
      { isPaused }
    )

    const commonAction = useMemoizedFn((record: Record<any, any>, action?: ProCoreActionType) => {
      return [
        <Button
          size="small"
          key="edit"
          type="primary"
          onClick={() => {
            updateVisibleMutation(true)
            setMutableId(record.id)
          }}
        >
          <EditOutlined /> 编辑
        </Button>,
        options.renderDetail ? (
          <Button
            size="small"
            key="edit"
            type="primary"
            onClick={() => {
              updateVisibleDescription(true)
              setMutableId(record.id)
            }}
          >
            <EditOutlined /> 查看
          </Button>
        ) : null,
        <Popconfirm
          key="delete"
          title="删除成就"
          description="你确定要删除该成就吗？"
          onConfirm={() => axios.delete(options.api + '?id=' + record.id).then(() => action?.reload())}
          okText="Yes"
          cancelText="No"
        >
          <Button size="small" danger>
            <DeleteOutlined /> 删除
          </Button>
        </Popconfirm>,
      ].filter(Boolean)
    })

    useEffect(() => {
      if (!visibleMutation) {
        setMutableId(undefined)
      }
    }, [visibleMutation])

    const columns = useMemo(() => {
      if (!client) {
        return options.columns
      }

      const columns = options.columns.slice()
      columns.unshift({
        title: 'ID',
        copyable: true,
        dataIndex: 'id',
        width: 100,
        hideInForm: true,
      })

      const column = last(columns)
      if (column?.valueType === 'option') {
        const _column = { ...column }
        const originalRender = column.render
        _column.hideInForm = true
        _column.render = (text, record, _, action, _1: any) => {
          let originalActions = originalRender?.(text, record, _, action, _1) as ReactNode | ReactNode[]

          if (!Array.isArray(originalActions)) {
            originalActions = [originalActions]
          }

          ;(originalActions as ReactNode[]).push(...commonAction(record, action))
          return originalActions
        }

        columns[columns.length - 1] = _column
      } else {
        if (!options.hideOption) {
          columns.push({
            title: '操作',
            valueType: 'option',
            key: 'option',
            hideInForm: true,
            render: (text, record, _, action) => commonAction(record, action),
          })
        }
      }

      return columns.map((item) => ({
        ...item,
        readonly: mutableId ? item.disabledInEdit : false,
        dataIndex: item.dataIndex ?? item.name,
        name: item.name ?? item.dataIndex,
        formItemProps: {
          ...item.formItemProps,
          rules: [
            ...((item.formItemProps as any)?.rules ?? []),
            ...(item.rules ?? []),
            ...(item.required ? [{ required: true, message: '此项为必填' }] : []),
          ],
        },
      }))
    }, [commonAction, client, mutableId])

    const onFinish = useMemoizedFn(async (values) => {
      const fileEntries = Object.entries(values).filter(
        ([key, value]) => Array.isArray(value) && value.some((item) => Boolean(item.originFileObj))
      )
      const stsAuthorizationInfo = await getSTSAuthorization()
      if (fileEntries.length) {
        const urlEntries = await Promise.all(
          fileEntries.map(async ([key, value]) => {
            return [
              key,
              (
                await Promise.all(
                  (value as UploadProps['fileList'])?.map(async (item) => {
                    if (item.url && !item.originFileObj) {
                      return item.url
                    }
                    if (!item.url && !item.originFileObj) {
                      return
                    }
                    if (item.originFileObj) {
                      return uploadFile(item.originFileObj, stsAuthorizationInfo)
                    }
                    // formData.append(key, item.originFileObj)
                  }) ?? []
                )
              ).join(','),
            ]
          })
        )
        values = merge({}, values, Object.fromEntries(urlEntries))
      }

      values = convertionApiValue(values, columns)

      if (mutableId) {
        return axios
          .put(`${options.api}?id=${mutableId}`, values)
          .then(async () => {
            notification.info({
              message: `编辑${options.title}成功`,
              description: '编辑时间:' + new Date().toLocaleString(),
            })
            await ref.current?.reloadAndRest?.()
            updateVisibleMutation(false)
          })
          .catch(() => {
            notification.error({
              message: `编辑${options.title}失败`,
              description: '编辑时间:' + new Date().toLocaleString(),
            })
          })
      }
      return axios
        .post(options.api, values)
        .then(async () => {
          notification.info({
            message: `创建${options.title}成功`,
            description: '编辑时间:' + new Date().toLocaleString(),
          })
          await ref.current?.reloadAndRest?.()
          updateVisibleMutation(false)
        })
        .catch(() => {
          notification.error({
            message: `创建${options.title}失败`,
            description: '编辑时间:' + new Date().toLocaleString(),
          })
        })
    })

    if (!client) {
      return null
    }

    return (
      <Layout>
        <PageContainer title={options.title}>
          <Drawer
            title={`编辑 ${options.title}`}
            placement="right"
            width="50vw"
            onClose={() => updateVisibleMutation(false)}
            open={visibleMutation}
          >
            {mutableId ? (
              <Spin spinning={isLoading}>
                {!data ? null : (
                  <BetaSchemaForm
                    grid={true}
                    columns={columns as any[]}
                    initialValues={!mutableId ? {} : data?.data}
                    onFinish={onFinish}
                  />
                )}
              </Spin>
            ) : (
              <BetaSchemaForm grid={true} columns={columns as any[]} onFinish={onFinish} />
            )}
          </Drawer>
          {!options.renderDetail ? null : (
            <Drawer
              title={`查看 ${options.title} ${data?.id}`}
              placement="right"
              width="50vw"
              onClose={() => updateVisibleDescription(false)}
              open={visibleDescription}
            >
              <Spin spinning={isLoading}>{!data ? null : options.renderDetail?.(data) ?? null}</Spin>
            </Drawer>
          )}
          <ProTable
            actionRef={ref}
            columns={columns}
            search={{ collapsed: false }}
            request={(params) =>
              axios.get(options.api, { params: convertionApiValue(params, columns) }).then((res) => res.data.data)
            }
            toolBarRender={(action) =>
              [
                options.hideOption ? null : (
                  <Button key="create" type="primary" onClick={() => updateVisibleMutation(true)}>
                    <PlusOutlined /> 创建
                  </Button>
                ),
                ...(options.renderToolbar?.(action) ?? []),
              ].filter(Boolean)
            }
          />
        </PageContainer>
      </Layout>
    )
  }

  Page.displayName = options.title
  return Page
}