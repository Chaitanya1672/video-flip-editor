import dynamic from 'next/dynamic'
import React, { useState, useRef, useEffect } from 'react'
import VideoControls from './VideoControls'
import { ReactPlayerProps } from 'react-player'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import styles from '../styles/VideoCropper.module.css'
import YouTubeIcon from '@mui/icons-material/YouTube'
import {
  PLEASE_CLICK_ON_START_CROPPER,
  PREVIEW,
  PREVIEW_NOT_AVAILABLE,
  VIDEO_URL,
} from '@/constants/constants'
import Draggable from 'react-draggable'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })
interface Props {
  showCropper: boolean
  showPreview: boolean
  setRecordingData: (data: any) => void
}

const VideoPlayerWithCropper = ({
  showCropper,
  showPreview,
  setRecordingData,
}: Props) => {
  const playerRef: any = useRef<ReactPlayerProps>(null)
  const previePlayerRef: any = useRef<ReactPlayerProps>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [cropperPosition, setCropperPosition] = useState({ x: 0, y: 0 })
  const [cropperSize, setCropperSize] = useState({ width: 0, height: 0 })
  const [aspectRatio, setAspectRatio] = useState(9 / 16)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const updateCropperSize = () => {
    if (!wrapperRef.current) return
    const { clientWidth, clientHeight } = wrapperRef.current
    const newHeight = clientHeight
    const newWidth = newHeight * aspectRatio
    setCropperSize({ width: newWidth, height: newHeight })
    setCropperPosition({ x: (clientWidth - newWidth) / 2, y: 0 })
  }

  useEffect(() => {
    updateCropperSize()
    window.addEventListener('resize', updateCropperSize)
    return () => window.removeEventListener('resize', updateCropperSize)
  }, [aspectRatio])

  useEffect(() => {
    playerRef && playerRef.current?.seekTo(currentTime)
    previePlayerRef && previePlayerRef.current?.seekTo(currentTime)
  }, [currentTime])

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && playerRef.current) {
        const newTime = playerRef.current.getCurrentTime()
        if (Math.abs(newTime - currentTime) > 1) {
          setCurrentTime(newTime)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [playing, currentTime])

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const handleDrag = (e: any, ui: any) => {
    const { x, y } = ui
    console.log(x, y)
    setCropperPosition({ x, y })
    if (showPreview) {
      setRecordingData((prevData: any) => [
        ...prevData,
        {
          timeStamp: currentTime,
          coordinates: [x, y, cropperSize.width, cropperSize.height],
          volume: volume,
          playbackRate: playbackRate,
        },
      ])
    }
  }

  return (
    <div className={styles.videoCropperContainer}>
      <div className={styles.videoContainer}>
        <div
          ref={wrapperRef}
          style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}
        >
          <ReactPlayer
            ref={playerRef}
            url={VIDEO_URL}
            playing={playing}
            volume={volume}
            playbackRate={playbackRate}
            onDuration={handleDuration}
            onReady={(player) => (playerRef.current = player)}
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          />
          {showCropper && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 999,
                width: '100%',
                height: '100%',
              }}
            >
              <Draggable
                position={cropperPosition}
                onDrag={handleDrag}
                bounds="parent"
                axis="both"
              >
                <Box
                  sx={{
                    width: cropperSize.width,
                    height: cropperSize.height,
                    border: '2px solid white',
                    boxSizing: 'border-box',
                    cursor: 'move',
                  }}
                >
                  <Grid container sx={{ height: '100%' }}>
                    {[0, 1, 2].map((row) =>
                      [0, 1, 2].map((col) => (
                        <Grid
                          item
                          xs={4}
                          key={`${row}-${col}`}
                          sx={{
                            borderRight:
                              col < 2
                                ? '1px dotted rgba(255, 255, 255, 0.7)'
                                : 'none',
                            borderBottom:
                              row < 2
                                ? '1px dotted rgba(255, 255, 255, 0.7)'
                                : 'none',
                          }}
                        />
                      )),
                    )}
                  </Grid>
                </Box>
              </Draggable>
            </div>
          )}
        </div>
        <VideoControls
          playbackRate={playbackRate}
          aspect={aspectRatio}
          setAspect={setAspectRatio}
          setPlaybackRate={setPlaybackRate}
          playing={playing}
          setPlaying={setPlaying}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          volume={volume}
          setVolume={setVolume}
          duration={duration || 0}
        />
      </div>
      <div className={styles.previewSection}>
        <Typography fontSize={12} color="#A0A0A0" gutterBottom>
          {PREVIEW}
        </Typography>
        {showPreview ? (
          <div
            style={{
              width: cropperSize.width,
              height: cropperSize.height,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <ReactPlayer
              ref={previePlayerRef}
              url={VIDEO_URL}
              playing={playing}
              onReady={(player) => (previePlayerRef.current = player)}
              volume={volume}
              playbackRate={playbackRate}
              width={
                wrapperRef.current ? wrapperRef.current.clientWidth : '100%'
              }
              height={
                wrapperRef.current ? wrapperRef.current.clientHeight : '100%'
              }
              style={{
                position: 'absolute',
                top: `-${cropperPosition.y}px`,
                left: `-${cropperPosition.x}px`,
              }}
            />
          </div>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="300px"
            color="#A0A0A0"
            textAlign="center"
            width="30%"
          >
            <IconButton>
              <YouTubeIcon sx={{ fontSize: 25, color: 'white' }} />
            </IconButton>
            <Typography variant="subtitle1" color="white" gutterBottom>
              {PREVIEW_NOT_AVAILABLE}
            </Typography>
            <Typography variant="body2" color="#A0A0A0">
              {PLEASE_CLICK_ON_START_CROPPER}
            </Typography>
          </Box>
        )}
      </div>
    </div>
  )
}

export default VideoPlayerWithCropper
