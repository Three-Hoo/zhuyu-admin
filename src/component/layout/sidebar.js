import {
  AlertOutlined,
  BellOutlined,
  BuildOutlined,
  CoffeeOutlined,
  CommentOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  FieldStringOutlined,
  FileMarkdownOutlined,
  FilePptOutlined,
  FileWordFilled,
  FireOutlined,
  MailOutlined,
  MessageOutlined,
  PayCircleOutlined,
  SmileOutlined,
  UserSwitchOutlined,
  UsergroupAddOutlined,
  WechatOutlined,
} from '@ant-design/icons'

const sidebar = {
  route: {
    path: '/',
    routes: [
      {
        path: '/dashboard/user',
        name: '用户管理',
        icon: <UserSwitchOutlined />,
        routes: [
          {
            path: '/dashboard/user/dashboard',
            name: '仪表盘',
            icon: <DashboardOutlined />,
          },
          {
            path: '/dashboard/user/user',
            name: '用户管理',
            icon: <UsergroupAddOutlined />,
          },
          {
            path: '/dashboard/user/achievement',
            name: '成就管理',
            icon: <AlertOutlined />,
          },
          {
            path: '/dashboard/user/task',
            name: '任务管理',
            icon: <FireOutlined />,
          },
        ],
      },
      {
        path: '/dashboard/payment',
        name: '支付管理',
        icon: <PayCircleOutlined />,
        routes: [
          {
            path: '/dashboard/payment/dashboard',
            name: '仪表盘',
            icon: <DashboardOutlined />,
          },
          {
            path: '/dashboard/payment/credit',
            name: '竹简管理',
            icon: <CreditCardOutlined />,
          },
          {
            path: '/dashboard/payment/member',
            name: '会员管理',
            icon: <MailOutlined />,
          },
        ],
      },
      {
        path: '/dashboard/message',
        name: '消息管理',
        icon: <MessageOutlined />,
        routes: [
          {
            path: '/dashboard/message/dashboard',
            name: '仪表盘',
            icon: <DashboardOutlined />,
          },
          {
            path: '/dashboard/message/push',
            name: '通知推送',
            icon: <BellOutlined />,
          },
          {
            path: '/dashboard/message/feedback',
            name: '用户反馈',
            icon: <UserSwitchOutlined />,
          },
        ],
      },
      {
        path: '/dashboard/content',
        name: '内容管理',
        icon: <FieldStringOutlined />,
        routes: [
          {
            path: '/dashboard/content/dashboard',
            name: '仪表盘',

            icon: <DashboardOutlined />,
          },
          {
            path: '/dashboard/content/wordbook',
            name: '单词本',
            icon: <FileWordFilled />,
          },
          {
            path: '/dashboard/content/word',
            name: '单词库',
            icon: <FilePptOutlined />,
          },
          {
            path: '/dashboard/message/post',
            name: '文章管理',
            icon: <FileMarkdownOutlined />,
          },
        ],
      },
      {
        path: '/dashboard/chat',
        name: '聊天管理',
        icon: <WechatOutlined />,
        routes: [
          {
            path: '/dashboard/chat/dashboard',
            name: '仪表盘',
            icon: <DashboardOutlined />,
          },
          {
            path: '/dashboard/chat/scene',
            name: '场景配置',
            icon: <CoffeeOutlined />,
          },
          {
            path: '/dashboard/chat/role',
            name: '角色管理',
            icon: <SmileOutlined />,
          },
          {
            path: '/dashboard/chat/present',
            name: '预设配置',
            icon: <BuildOutlined />,
          },
          {
            path: '/dashboard/chat/room',
            name: '聊天房间管理',
            icon: <CommentOutlined />,
          },
        ],
      },
    ],
  },
}

export default sidebar