import React from 'react'
import styles from '../styles/Home.module.css'
import {
  CROPPER,
  GENERATE_SESSION_BUTTON_TEXT,
  PREVIEW_BUTTON_TEXT,
} from '@/constants/constants'

interface Props {
  handleShowPreviewSession: (showPreviewSession: boolean) => void
  showPreviewSession: boolean
}

const NavBar = ({ handleShowPreviewSession, showPreviewSession }: Props) => {
  return (
    <div className={styles.header}>
      <h1>{CROPPER}</h1>
      <div className={styles.buttons}>
        <button
          onClick={() => handleShowPreviewSession(true)}
          className={`${showPreviewSession ? styles.active : ''}`}
        >
          {PREVIEW_BUTTON_TEXT}
        </button>
        <button
          onClick={() => handleShowPreviewSession(false)}
          className={`${!showPreviewSession ? styles.active : ''}`}
        >
          {GENERATE_SESSION_BUTTON_TEXT}
        </button>
      </div>
    </div>
  )
}

export default NavBar
