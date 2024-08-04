'use client'
import React, { useEffect, useState } from 'react'
import styles from '../styles/VideoCropper.module.css'
import Footer from './Footer'
import NavBar from './NavBar'
import VideoPlayerWithCropper from './VideoPlayerWithCropper'
import { PLEASE_CLICK_ON_START_CROPPER_TO_GENERATE_PREVIEW } from '@/constants/constants'

const VideoCropper = () => {
  const [showCropper, setShowCropper] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  useEffect(() => {
    if(!showCropper) {
      setShowPreview(false)
    }
  }, [showCropper])

  const generatePreview = () => {
    if (!showCropper) {
      alert(PLEASE_CLICK_ON_START_CROPPER_TO_GENERATE_PREVIEW)
      return
    }
    setShowPreview(true)
  }

  return (
    <div className={styles.container}>
      <div>
        <NavBar />
        <div>
          <VideoPlayerWithCropper
            showCropper={showCropper}
            showPreview={showPreview}
          />
        </div>
      </div>
      <Footer
        generatePreview={generatePreview}
        setShowCropper={setShowCropper}
      />
    </div>
  )
}

export default VideoCropper
