import React from 'react'

export const useHydrated = () => {
  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => {
    // This forces a rerender, so the date is rendered
    // the second time but not the first
    setHydrated(true)
  }, [])

  return hydrated
}
