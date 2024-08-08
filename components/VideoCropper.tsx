'use client'
import React, { useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
import styles from '../styles/VideoCropper.module.css'
import Footer from './Footer'
import NavBar from './NavBar'
import VideoPlayerWithCropper from './VideoPlayerWithCropper'
import {
  PLEASE_CLICK_ON_START_CROPPER_TO_GENERATE_PREVIEW,
  PLEASE_RECORD_DATA_TO_GENERATE_SESSION,
} from '@/constants/constants'

const VideoCropper = () => {
  const [showCropper, setShowCropper] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showPreviewSession, setShowPreviewSession] = useState(true)
  const [recordingData, setRecordingData] = useState<any[]>([])

  useEffect(() => {
    if (!showCropper) {
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

  const downloadJSON = () => {
    const jsonData = JSON.stringify(recordingData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    console.log('Coordinates Recording Data', recordingData)
    saveAs(blob, 'coord_recording_data.json')
  }
  const handleShowPreviewSession = (value: boolean) => {
    if (recordingData.length > 0) {
      setShowPreviewSession(value)
    } else {
      alert(PLEASE_RECORD_DATA_TO_GENERATE_SESSION)
      return
    }
  }
  return (
    <div className={styles.container}>
      <div>
        <NavBar
          handleShowPreviewSession={handleShowPreviewSession}
          showPreviewSession={showPreviewSession}
        />
        <div>
          <VideoPlayerWithCropper
            showCropper={showCropper}
            showPreview={showPreview}
            setRecordingData={setRecordingData}
          />
        </div>
      </div>
      <Footer
        generatePreview={generatePreview}
        setShowCropper={setShowCropper}
        downloadJSON={downloadJSON}
        showPreview={showPreview}
      />
    </div>
  )
}

export default VideoCropper
