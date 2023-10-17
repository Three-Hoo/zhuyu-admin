import { ProLayout } from '@ant-design/pro-components'
import React from 'react'
import { bgLayoutImgList, settings } from './settings'
import { avatarConfiguration, renderMenuItem } from './helper'
import Image from 'next/image'
import sidebar from './sidebar'
import { useRouter } from 'next/router'

const Layout = (props) => {
  const router = useRouter()
  return (
    <div
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ProLayout
        bgLayoutImgList={bgLayoutImgList}
        location={{ pathname: router.pathname }}
        logo={<Image alt="logo" src="/logo.png" width="22" height="22" />}
        title="竹语管理后台"
        collapsed={false}
        avatarProps={avatarConfiguration}
        actionsRender={() => []}
        menuItemRender={renderMenuItem}
        theme='light'
        {...settings}
        {...sidebar}
      >
        {props.children}
      </ProLayout>
    </div>
  )
}

export default Layout
