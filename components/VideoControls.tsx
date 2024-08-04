import React from 'react'
import { Select, MenuItem, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { IconButton, Slider, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import {
  ASPECT_RATIOS,
  CROPPER_ASPECT_RATIO,
  PLAY_BACK_SPEED,
  PLAYBACK_RATES,
  RATE_LABELS,
  RATIO_LABELS,
} from '@/constants/constants'

const DarkSelect = styled(Select)(() => ({
  backgroundColor: '#37393f',
  color: 'white',
  '& .MuiSelect-icon': {
    color: 'white',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  padding: '2px 4px',
  borderRadius: '4px',
}))

const StyledMenuItem = styled(MenuItem)({
  fontSize: '14px',
})

interface Props {
  aspect: number
  playbackRate: number
  playing: boolean
  volume: number
  currentTime: number
  duration: number
  setCurrentTime: (currentTime: number) => void
  setAspect: (aspect: number) => void
  setPlaybackRate: (playbackRate: number) => void
  setPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
}

function VideoControls({
  aspect,
  playbackRate,
  playing,
  volume,
  currentTime,
  duration,
  setCurrentTime,
  setAspect,
  setPlaybackRate,
  setPlaying,
  setVolume,
}: Props) {
  const formatTimeWithRemaining = (
    currentTime: number,
    duration: number,
  ): string => {
    const formatSegment = (time: number) => {
      const date = new Date(time * 1000)
      const hh = date.getUTCHours().toString().padStart(2, '0')
      const mm = date.getUTCMinutes().toString().padStart(2, '0')
      const ss = date.getUTCSeconds().toString().padStart(2, '0')
      return `${hh}:${mm}:${ss}`
    }

    const remainingTime = Math.max(0, duration - currentTime)

    const currentFormatted = formatSegment(currentTime)
    const remainingFormatted = formatSegment(remainingTime)

    return `${currentFormatted} | ${remainingFormatted}`
  }
  return (
    <Box
      sx={{
        gap: 2,
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px'  }}>
        <IconButton
          sx={{ padding: 0, color: '#fff' }}
          onClick={() => setPlaying(!playing)}
        >
          {playing ? (
            <PauseIcon fontSize="large" />
          ) : (
            <PlayArrowIcon fontSize="large" />
          )}
        </IconButton>
        <Slider
          value={currentTime}
          onChange={(e: any, newValue: any) => {
            setCurrentTime(parseFloat(newValue))
          }}
          min={0}
          max={duration}
          step={1}
          sx={{ mx: 2, flexGrow: 1, color: '#fff', margin: '0 0 0 8px' }}
          size="small"
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: '#fff', marginRight: '8px', whiteSpace: 'nowrap' }}
        >
          {formatTimeWithRemaining(currentTime, duration)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#fff' }}>
            <VolumeUpIcon />
          </IconButton>
          <Slider
            value={volume}
            onChange={(e: any, newValue: any) =>
              setVolume(parseFloat(newValue))
            }
            min={0}
            max={1}
            step={0.01}
            sx={{ mx: 2, width: '60px', color: '#fff', margin: '0' }}
            size="small"
          />
        </Box>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Typography
            variant="body2"
            sx={{ color: 'white', whiteSpace: 'nowrap' }}
          >
            {PLAY_BACK_SPEED}
          </Typography>
          <DarkSelect
            value={playbackRate}
            onChange={(e: any) => setPlaybackRate(parseFloat(e.target.value))}
            size="small"
            // @ts-ignore
            renderValue={(value) => RATE_LABELS[value] || `${value}x`}
            defaultValue={1}
          >
            {Object.entries(PLAYBACK_RATES).map(([label, value]) => (
              <StyledMenuItem key={label} value={value}>
                {label}
              </StyledMenuItem>
            ))}
          </DarkSelect>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Typography
            variant="body2"
            sx={{ color: 'white', whiteSpace: 'nowrap' }}
          >
            {CROPPER_ASPECT_RATIO}
          </Typography>
          <DarkSelect
            value={aspect}
            onChange={(e: any) => setAspect(parseFloat(e.target.value))}
            size="small"
            renderValue={(value: any) => RATIO_LABELS[value] || value}
          >
            {Object.entries(ASPECT_RATIOS).map(([label, value]) => (
              <StyledMenuItem key={label} value={value}>
                {label}
              </StyledMenuItem>
            ))}
          </DarkSelect>
        </div>
      </div>
    </Box>
  )
}

export default VideoControls
