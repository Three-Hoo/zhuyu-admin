import React from 'react'
import Layout from '../../../component/layout'
import { PageContainer } from '@ant-design/pro-components'
import Link from 'next/link'

function User(props) {
  return (
    <Layout>
      <PageContainer>
        <Link href="/dashboard/user/achievement">成就</Link>
      </PageContainer>
    </Layout>
  )
}

export default User
