import Layout from '@/component/layout'
import { PageContainer, ProFormSelect } from '@ant-design/pro-components'
import { useMemoizedFn } from 'ahooks/lib'
import { Space } from 'antd'
import { Card, Row, Col, Select, Button } from 'antd/lib'
import { sample } from 'lodash'
import React, { useRef, useState } from 'react'

const randoms = ['海马', '黑猫', '衔蝉', '春蚕', '麋鹿', '白羊']

export const SystemRandom = () => {
  const [exclude, setExclude] = useState<string>()
  const [selected, setSelected] = useState<string>()
  const ref = useRef(0)

  const handleRandom = useMemoizedFn(() => {
    let t = setInterval(() => {
      ref.current++
      setSelected(sample(randoms.filter((name) => name !== exclude)))
      if (ref.current === 15) {
        clearInterval(t)
      }
    }, 600)
  })

  return (
    <Layout>
      <PageContainer>
        <ProFormSelect
          label="排除"
          valueEnum={Object.fromEntries(randoms.map((item) => [item, item]))}
          onChange={(value: string) => {
            setExclude(value)
          }}
        />
        <Row gutter={[8, 8]}>
          {randoms.map((item) => (
            <Col span={8} key={item}>
              <Card
                bordered
                bodyStyle={{
                  color: item === exclude ? '#999' : 'black',
                  background:
                    ref.current === 15 && item === selected ? '#ff000042' : item === exclude ? '#f0f2f5' : 'white',
                  borderColor: selected === item ? 'red' : 'white',
                  borderWidth: '5px',
                  borderStyle: 'dotted',
                }}
              >
                {item}
              </Card>
            </Col>
          ))}
        </Row>
        <div style={{ marginTop: 20 }}></div>
        <Space>
          <Button size="large" type="primary" onClick={handleRandom}>
            随机
          </Button>
          <Button
            size="large"
            type="primary"
            ghost
            onClick={() => {
              ref.current = 0
              setSelected('')
            }}
          >
            重置
          </Button>
        </Space>
      </PageContainer>
    </Layout>
  )
}

export default SystemRandom
