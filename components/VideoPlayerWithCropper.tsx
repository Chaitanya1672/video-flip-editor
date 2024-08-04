import dynamic from 'next/dynamic'
import React, { useState, useRef, useEffect, useCallback } from 'react'
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

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })
interface Props {
  showCropper: boolean
  showPreview: boolean
}

const VideoPlayerWithCropper = ({ showCropper, showPreview }: Props) => {
  const playerRef: any = useRef<ReactPlayerProps>(null)
  const previePlayerRef: any = useRef<ReactPlayerProps>(null)
  const wrapperRef = useRef<any>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [cropperPosition, setCropperPosition] = useState({ x: 0, y: 0 })
  const [cropperSize, setCropperSize] = useState({ width: 0, height: 0 })
  const [aspectRatio, setAspectRatio] = useState(9 / 16)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const updateCropperSize = () => {
    if (!wrapperRef.current) return
    const { clientWidth, clientHeight } = wrapperRef.current
    const newHeight = clientHeight
    const newWidth = newHeight * aspectRatio
    setCropperSize({ width: newWidth, height: newHeight })
    setCropperPosition({ x: (clientWidth - newWidth) / 2, y: 0 })
    setDragStart({ x: (clientWidth - newWidth) / 2, y: 0 })
  }

  useEffect(() => {
    updateCropperSize()
    window.addEventListener('resize', updateCropperSize)
    return () => window.removeEventListener('resize', updateCropperSize)
  }, [aspectRatio])

  useEffect(() => {
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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - cropperPosition.x,
        y: e.clientY - cropperPosition.y,
      })
    },
    [cropperPosition],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && wrapperRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect()
        const newX = e.clientX - wrapperRect.left - dragStart.x
        const newY = e.clientY - wrapperRect.top - dragStart.y

        const maxX = wrapperRect.width - cropperSize.width
        const maxY = wrapperRect.height - cropperSize.height

        setCropperPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        })
      }
    },
    [isDragging, dragStart, cropperSize.width, cropperSize.height],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

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
            onReady={(player): any => (playerRef.current = player)}
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
            <Box
              sx={{
                position: 'absolute',
                top: cropperPosition.y,
                left: cropperPosition.x,
                width: cropperSize.width,
                height: cropperSize.height,
                border: '2px solid white',
                boxSizing: 'border-box',
                cursor: 'move',
              }}
              onMouseDown={handleMouseDown}
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
