const pastEntries = []

const predictAddEntryAndGetAverages = ({ annotations, frameLookback }) => {
  let earLR = areEyesClosed(annotations)

  if (pastEntries.length >= frameLookback) pastEntries.shift()
  pastEntries.push(earLR)

  const res = { left: 0, right: 0 }

  pastEntries.forEach((obj, i) => {
    res.left += obj.left
    res.right += obj.right
  })

  res.left /= pastEntries.length
  res.right /= pastEntries.length

  return res
}

const predictLandmarks = async ({
  videoRef,
  canvasRef,
  faceNetwork,
  onGetEarState,
  frameLookback,
}) => {
  if (videoRef && canvasRef && faceNetwork) {
    canvasRef.width = videoRef.videoWidth
    canvasRef.height = videoRef.videoHeight
    const context = canvasRef.getContext('2d')
    const predictions = await faceNetwork.estimateFaces({ input: videoRef })

    if (predictions.length > 0) {
      context.clearRect(0, 0, canvasRef.width, canvasRef.height)
      onGetEarState(
        predictAddEntryAndGetAverages({
          annotations: predictions[0].annotations,
          frameLookback,
        })
      )

      predictions.forEach((prediction, i) => {
        const annotations = prediction.annotations

        let keypoints = []
        Object.keys(annotations).forEach((objName, i) => {
          if (objName.includes('leftEye') || objName.includes('rightEye'))
            keypoints.push(...annotations[objName])
        })

        context.fillStyle = '#0000ff'
        context.beginPath()

        keypoints.forEach((obj, j) => {
          const [x, y, z] = obj.map((item) => Math.floor(item))
          context.moveTo(x, y)
          context.arc(x, y, 1, 0, Math.PI * 2, true)
        })
        context.fill()
      })
    }
  }
}

const getMag = ([x, y, z]) => {
  return Math.sqrt(x * x + y * y + z * z)
}

const subVectors = (a, b) => {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

const areEyesClosed = (annotations) => {
  const lel = annotations.leftEyeLower0
  const leu = annotations.leftEyeUpper0
  const rel = annotations.rightEyeLower0
  const reu = annotations.rightEyeUpper0

  const earLeft =
    getMag(subVectors(leu[4], lel[4])) / getMag(subVectors(lel[6], lel[0]))
  const earRight =
    getMag(subVectors(reu[4], rel[4])) / getMag(subVectors(rel[6], rel[0]))
  return { right: earRight, left: earLeft }
}

export default predictLandmarks
