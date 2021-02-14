/** @jsx jsx */
import { Button, Box, Flex, Heading, Text, jsx } from 'theme-ui'
import { useRef } from 'react'
import Webcam from 'react-webcam'
import predictLandmarks from '../algo/face'
import { useEffect } from 'react'
import { navigate } from 'gatsby'
import * as faceLandmarkDetection from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs'
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm'
import { useState } from 'react'
import { useSettingsInfo } from '../context/settings.context'
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerAnimation } from '../animation/animations'

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
)

const EarCard = ({ direction, value, ...props }) => {
  return (
    <Box
      sx={{
        borderRadius: 'default',
        p: '1.25rem',
        color: 'background',
        bg: 'text',
        width: '100%',
      }}
      {...props}
    >
      <Text sx={{ fontWeight: 'medium' }}>EAR ({direction})</Text>
      <Heading sx={{ mt: 2 }}>{value}</Heading>
    </Box>
  )
}

const IndexPage = () => {
  const {
    earThreshold,
    maxFPS,
    frameLookback,
    sendAlertToEnabled,
    sendAlertToURI,
    carSpeedCheckEnabled,
    carSpeedCheckURI,
    bruhShiJianEnabled,
  } = useSettingsInfo()

  const [earState, setEarState] = useState({ left: 0.5, right: 0.5 })

  const webcam = useRef(null)
  const canvas = useRef(null)
  const timer = useRef(null)
  const audio = useRef(
    new Audio(bruhShiJianEnabled ? '/bruhshijian.mp3' : '/chime.mp3')
  )

  const checkIfCarRunning = useCallback(async (URI) => {
    try {
      const data = await fetch(URI)
      return data.json().running
    } catch (e) {
      console.log('Error fetching car info')
    }
  }, [])

  const callAlertToURI = useCallback((URI) => {
    try {
      fetch(URI)
    } catch (e) {
      console.log('Error alerting URI')
    }
  }, [])

  useEffect(() => {
    const doPredictions = async () => {
      const faceNetwork = await faceLandmarkDetection.load(
        faceLandmarkDetection.SupportedPackages.mediapipeFacemesh
      )

      timer.current = setInterval(async () => {
        predictLandmarks({
          videoRef: webcam.current.video,
          canvasRef: canvas.current,
          faceNetwork,
          onGetEarState: setEarState,
          frameLookback,
        })
        await tf.nextFrame()
      }, 1000 / maxFPS)
    }

    tf.setBackend('wasm').then(() => {
      webcam.current.video.addEventListener('loadeddata', (e) => {
        doPredictions()
      })
    })

    return () => {
      clearInterval(timer.current)
    }
  }, [frameLookback, maxFPS])

  useEffect(() => {
    audio.current.volume = 0.5

    const alert = async () => {
      if (earState.left < earThreshold && earState.right < earThreshold) {
        let carIsOn = true
        if (carSpeedCheckEnabled)
          carIsOn = await checkIfCarRunning(carSpeedCheckURI)

        if (carIsOn && sendAlertToEnabled) {
          callAlertToURI(sendAlertToURI)
        } else if (carIsOn && !audio.current.isPlaying) {
          audio.current.play()
        }
      }
    }

    alert()
  }, [
    earState,
    sendAlertToURI,
    sendAlertToEnabled,
    carSpeedCheckURI,
    carSpeedCheckEnabled,
    checkIfCarRunning,
    callAlertToURI,
    earThreshold,
  ])

  return (
    <Flex
      sx={{
        p: 5,
        height: '100vh',
      }}
    >
      <Flex
        sx={{
          width: '100vw',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          height: 'auto',
          flex: 1,
        }}
      >
        <motion.div
          initial='initial'
          animate='animate'
          variants={staggerAnimation}
        >
          <Box
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 'default',
              bg: 'red',
              color: 'background',
              textAlign: 'center',
              opacity:
                earState.left < earThreshold && earState.right < earThreshold
                  ? '100%'
                  : '0%',
            }}
          >
            <Heading as='h3'>Drowsiness detected!</Heading>
          </Box>
          <motion.div variants={fadeInUp()}>
            <Heading
              as='h1'
              sx={{
                fontSize: 7,
              }}
            >
              Focus
            </Heading>
          </motion.div>
          <motion.div variants={fadeInUp()}>
            <Heading
              as='h2'
              sx={{
                color: 'rgba(120,120,120,1)',
              }}
            >
              Stay focused while you drive.
            </Heading>
          </motion.div>
          <motion.div variants={fadeInUp()}>
            <Flex
              sx={{
                mt: 3,
                flexDirection: 'row',
              }}
            >
              <EarCard direction='left' value={earState.left.toFixed(2)} />
              <EarCard
                direction='right'
                value={earState.right.toFixed(2)}
                sx={{ ml: 3 }}
              />
            </Flex>
            <Button
              sx={{
                mt: 3,
                width: '100%',
              }}
              onClick={() => {
                clearInterval(timer.current)
                navigate('/settings')
              }}
            >
              Settings
            </Button>
            <Button
              variant='secondary'
              sx={{
                mt: 3,
                width: '100%',
              }}
              onClick={() => {
                clearInterval(timer.current)
                navigate('/about')
              }}
            >
              Info / About
            </Button>
          </motion.div>
        </motion.div>
      </Flex>
      <Flex
        sx={{
          width: '100vw',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          height: 'auto',
          flex: 1,
          bg: 'text',
          color: 'background',
          borderRadius: 'default',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            p: 4,
          }}
        >
          <Webcam
            audio={false}
            ref={webcam}
            sx={{
              m: 'auto',
              width: '100%',
              borderRadius: 'default',
            }}
          />
          <canvas
            ref={canvas}
            sx={{
              m: 'auto',
              width: '100%',
              px: 'inherit',
              pb: 'inherit',
              position: 'absolute',
              left: 0,
              right: 0,
              zIndex: 999,
            }}
          />
        </Box>
      </Flex>
    </Flex>
  )
}

export default IndexPage
