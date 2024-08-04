import React from 'react'
import styles from '../styles/Home.module.css'
import {
  CROPPER,
  GENERATE_SESSION_BUTTON_TEXT,
  PREVIEW_BUTTON_TEXT,
} from '@/constants/constants'

const NavBar = () => {
  return (
    <div className={styles.header}>
      <h1>{CROPPER}</h1>
      <div className={styles.buttons}>
        <button>{PREVIEW_BUTTON_TEXT}</button>
        <button>{GENERATE_SESSION_BUTTON_TEXT}</button>
      </div>
    </div>
  )
}

export default NavBar
