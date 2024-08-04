import React from 'react'
import Head from 'next/head'
import VideoCropper from '../components/VideoCropper'
import styles from '../styles/Home.module.css'

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Video Cropper</title>
        <meta
          name="description"
          content="Dynamic video cropper using Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.modal}>
          <VideoCropper />
        </div>
      </main>
    </div>
  )
}

export default Home
