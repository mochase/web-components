// star打分组件, 包含过渡动画.

import React, { useRef, useEffect, useState } from 'react'
import './index.less'
import { throttle } from 'lodash'

export default function Stars (props) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current.style.setProperty('--score', props.score || 0)
  }, [props.score])

  useEffect(() => {
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const fn = throttle((ev) => {
      const clientX = ev.clientX
      const clientY = ev.clientY
      if (clientX > left && clientX < left + width && clientY > top && clientY < top + height) {
        const score = Math.ceil((clientX - left) / width * 5)
        ref.current.style.setProperty('--score', score || 0)
      }
    }, 150)
    if (props.isReactive) {
      document.addEventListener('mousemove', fn)
    }

    return () => {
      document.removeEventListener('mousemove', fn)
    }
  }, [props.isReactive])

  const clickHandle = (e) => {
    if (props.isReactive && typeof props.submit === 'function') {
      const rate = ref.current.style.getPropertyValue('--score')
      props.submit(rate)
    }
  }

  return (
    <div className="stars" ref={ref} onClickCapture={clickHandle}></div>
  )
}