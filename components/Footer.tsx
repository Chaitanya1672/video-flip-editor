import React from 'react'
import styles from '../styles/Home.module.css'
import { GENERATE_PREVIEW_BUTTON_TEXT, REMOVE_CROPPER_BUTTON_TEXT, START_CROPPER_BUTTON_TEXT } from '@/constants/constants'

interface Props {
  generatePreview: () => void
  setShowCropper: (showCropper: boolean) => void
}
const Footer = ({ generatePreview, setShowCropper }: Props) => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerButtons}>
        <button onClick={() => setShowCropper(true)}>{START_CROPPER_BUTTON_TEXT}</button>
        <button onClick={() => setShowCropper(false)}>{REMOVE_CROPPER_BUTTON_TEXT}</button>
        <button onClick={generatePreview}>{GENERATE_PREVIEW_BUTTON_TEXT}</button>
      </div>
      <button>Cancel</button>
    </div>
  )
}

export default Footer
