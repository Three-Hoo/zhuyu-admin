import { Dropdown } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import React from 'react'
import Link from 'next/link'

export const avatarConfiguration = {
  src: '/logo.png',
  size: 'small',
  title: '竹语',
  render: (props, dom) => {
    return (
      <Dropdown
        menu={{
          items: [
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
            },
          ],
        }}
      >
        {dom}
      </Dropdown>
    )
  },
}

export const renderMenuItem = (item, dom) => {
  return <Link href={item.path}>{dom}</Link>
}
