import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormText } from '@ant-design/pro-components'
import useSWRMutation from 'swr/mutation'
import axios from 'axios'
import { useRouter } from 'next/router'

import { withSessionSsr } from '../utils/session'

// eslint-disable-next-line react/display-name,import/no-anonymous-default-export
const Login = () => {
  const router = useRouter()
  const { trigger } = useSWRMutation('/api/login', (url, { arg }) => axios.post(url, arg), {
    onSuccess: () => router.replace('/dashboard'),
  })

  return (
    <LoginForm logo="/logo.png" title="竹语" subTitle="后台管理" onFinish={trigger} message="登录失败">
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={'prefixIcon'} />,
        }}
        placeholder="用户名: admin"
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        placeholder="密码"
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
    </LoginForm>
  )
}

export const getServerSideProps = withSessionSsr(({ req }) => {
  const user = req.session.user
  if (user && user.expires > Date.now()) {
    return {
      redirect: {
        destination: '/dashboard/user/user',
        permanent: false,
      },
    }
  }
  return { props: { user } }
})

export default Login
