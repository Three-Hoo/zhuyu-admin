import { PostTextToSpeak } from '@/pages/api/text-to-speak'
import { useMemoizedFn } from 'ahooks/lib'
import axios from 'axios'
import { isEmpty, isEqual } from 'lodash'
import { useEffect, useRef } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'
import useSWRMutation from 'swr/mutation'

export const useTextToSpeak = (options: PostTextToSpeak) => {
  const { trigger, isMutating } = useSWRMutation('/api/text-to-speak', (key, { arg }: { arg: PostTextToSpeak }) =>
    axios.get(key, { params: arg })
  )
  const isLoaded = useRef<boolean>()
  const { load, pause, isLoading, playing, play } = useAudioPlayer()

  useEffect(() => {
    isLoaded.current = false
  }, [options.content, options.rate, options.styledegree, options.style])

  const handlePlay = useMemoizedFn(async (playOption?: Partial<PostTextToSpeak>) => {
    const keys = Object.keys(playOption || {})

    if (
      keys.length &&
      keys.some((key) => playOption?.[key as keyof PostTextToSpeak] !== options[key as keyof PostTextToSpeak])
    ) {
      isLoaded.current = false
    }

    if (isLoaded.current) {
      play()
      return
    }

    const data = await trigger({
      content: playOption?.content ?? options.content,
      rate: playOption?.rate ?? options.rate,
      styledegree: playOption?.styledegree ?? options.styledegree,
      style: playOption?.style ?? options.style,
      role: playOption?.role ?? options.role,
    })

    load(location.protocol + '//' + data.data.data.Location, {
      autoplay: true,
      onload() {
        isLoaded.current = true
      },
    })
  })

  return {
    isLoading: isLoading || isMutating,
    playing,
    pause,
    play: handlePlay,
    togglePlay: (playOption?: Partial<PostTextToSpeak>) => {
      if (playing) {
        pause()
      } else {
        handlePlay(playOption)
      }
    },
  }
}
