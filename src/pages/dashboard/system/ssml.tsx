import Layout from '@/component/layout'
import { VOICE_STYLE_MAP } from '@/sources/value-enum/voice-style'
import { VOICE_LIST, VOICE_MAP } from '@/sources/value-enum/voices-list'
import {
  PageContainer,
  ProForm,
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
  ProFormTextArea,
} from '@ant-design/pro-components'
import { useMemoizedFn } from 'ahooks/lib'
import { Modal, Space } from 'antd'
import { Card, Row, Col, Select, Button } from 'antd/lib'
import axios from 'axios'
import { sample, upperFirst } from 'lodash'
import React, { useRef, useState } from 'react'

const microsoftVoicenames = VOICE_LIST.map((item) => [
  item.ShortName,
  `${item.LocalName}(${item.Gender}-${item.Locale}-语气数量:${item.StyleList?.length ?? 1})`,
  item.StyleList?.length,
]).sort((a, b) => {
  const element1 = a as [unknown, string, number]
  const element2 = b as [unknown, string, number]
  return (element2[2] ?? 0) - (element1[2] ?? 0)
}) as [string, string, number][]

export const SystemRandom = () => {
  return (
    <Layout>
      <PageContainer>
        <ProForm
          onFinish={async (values) => {
            let response
            if (values.mode === 'ssml') {
              response = await axios.post('/api/text-to-speak-ssml', { ssml: values.ssml })
            } else {
              response = await axios.get('/api/text-to-speak', { params: values })
            }

            Modal.info({
              title: '生成结果',
              content: (
                <Row gutter={16}>
                  <Col>
                    <audio controls src={'//' + response.data.data.Location} autoPlay />
                  </Col>
                </Row>
              ),
              closable: true,
              maskClosable: true,
            })

            // response.data.data.Location
          }}
        >
          <ProFormRadio.Group
            name="mode"
            initialValue="normal"
            radioType="button"
            options={[
              {
                label: '普通模式',
                value: 'normal',
              },
              {
                label: 'SSML 模式',
                value: 'ssml',
              },
            ]}
          ></ProFormRadio.Group>
          <ProFormDependency name={['mode']}>
            {({ mode }) => {
              if (mode === 'ssml') {
                return (
                  <ProFormTextArea
                    label="SSML"
                    required
                    fieldProps={{ rows: 10 }}
                    placeholder={`<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="string">
    <mstts:backgroundaudio src="string" volume="string" fadein="string" fadeout="string"/>
    <voice name="string" effect="string">
        <audio src="string"></audio>
        <bookmark mark="string"/>
        <break strength="string" time="string" />
        <emphasis level="value"></emphasis>
        <lang xml:lang="string"></lang>
        <lexicon uri="string"/>
        <math xmlns="http://www.w3.org/1998/Math/MathML"></math>
        <mstts:audioduration value="string"/>
        <mstts:express-as style="string" styledegree="value" role="string"></mstts:express-as>
        <mstts:silence type="string" value="string"/>
        <mstts:viseme type="string"/>
        <p></p>
        <phoneme alphabet="string" ph="string"></phoneme>
        <prosody pitch="value" contour="value" range="value" rate="value" volume="value"></prosody>
        <s></s>
        <say-as interpret-as="string" format="string" detail="string"></say-as>
        <sub alias="string"></sub>
    </voice>
</speak>`}
                    tooltip={
                      <a
                        target="_blank"
                        style={{ color: 'white', textDecoration: 'underline' }}
                        href="https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup"
                      >
                        阅读SSML文档
                      </a>
                    }
                    name="ssml"
                  />
                )
              }

              return (
                <Row gutter={[32, 0]}>
                  <Col span={8}>
                    <ProFormSelect
                      required
                      name="role"
                      label="微软发音人"
                      showSearch
                      valueEnum={Object.fromEntries(microsoftVoicenames)}
                    />
                  </Col>
                  <ProFormDependency name={['role']}>
                    {({ role }) => (
                      <Col span={8}>
                        <ProFormSelect
                          required
                          name="style"
                          label="语气"
                          showSearch
                          valueEnum={Object.fromEntries(
                            (VOICE_MAP[role]?.StyleList?.map((item) =>
                              VOICE_STYLE_MAP[item] ? [item, VOICE_STYLE_MAP[item]] : null
                            ).filter(Boolean) as [string, string][]) ?? []
                          )}
                        />
                      </Col>
                    )}
                  </ProFormDependency>
                  <Col span={4}>
                    <ProFormSlider
                      required
                      name="styledegree"
                      initialValue={1}
                      min={0.01}
                      max={2}
                      step={0.05}
                      label="风格强度"
                    />
                  </Col>
                  <Col span={4}>
                    <ProFormSlider
                      required
                      name="rate"
                      initialValue={2}
                      min={0}
                      max={5}
                      step={1}
                      marks={{
                        0: '超慢',
                        1: '普慢',
                        2: '默认',
                        3: '中等',
                        4: '普快',
                        5: '超快',
                      }}
                      label="语速"
                    />
                  </Col>
                  <Col span={24}>
                    <ProFormTextArea required name="content" label="语音内容" />
                  </Col>
                </Row>
              )
            }}
          </ProFormDependency>
        </ProForm>
      </PageContainer>
    </Layout>
  )
}

export default SystemRandom
