import React from 'react'

export const isClient = typeof document !== 'undefined'

export const renderInClient = (Component) => {
  return isClient ? <Component /> : null
}
