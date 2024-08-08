import React from 'react'
import styles from '../styles/Home.module.css'
import {
  DOWNLOAD_JSON,
  GENERATE_PREVIEW_BUTTON_TEXT,
  REMOVE_CROPPER_BUTTON_TEXT,
  START_CROPPER_BUTTON_TEXT,
} from '@/constants/constants'

interface Props {
  generatePreview: () => void
  setShowCropper: (showCropper: boolean) => void
  downloadJSON: () => void
  showPreview: boolean
}
const Footer = ({
  generatePreview,
  setShowCropper,
  downloadJSON,
  showPreview,
}: Props) => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerButtons}>
        <button onClick={() => setShowCropper(true)}>
          {START_CROPPER_BUTTON_TEXT}
        </button>
        <button onClick={() => setShowCropper(false)}>
          {REMOVE_CROPPER_BUTTON_TEXT}
        </button>
        <button onClick={generatePreview}>
          {GENERATE_PREVIEW_BUTTON_TEXT}
        </button>
        {showPreview && <button onClick={downloadJSON}>{DOWNLOAD_JSON}</button>}
      </div>
      <button>Cancel</button>
    </div>
  )
}

export default Footer
