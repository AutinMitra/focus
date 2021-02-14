/** @jsx jsx */
import { jsx } from 'theme-ui'
import { createContext, useEffect, useState, useContext, Fragment } from 'react'

const defaultValues = {
  earThreshold: 0.3,
  maxFPS: 15,
  frameLookback: 50,
  sendAlertToEnabled: false,
  sendAlertToURI: '',
  carSpeedCheckEnabled: false,
  carSpeedCheckURI: '',
}

const SettingsContext = createContext({})

export const SettingsProvider = ({ children }) => {
  const providerInfo =
    localStorage.getItem('settings') ?? JSON.stringify(defaultValues)

  const {
    earThreshold,
    maxFPS,
    frameLookback,
    sendAlertToEnabled,
    sendAlertToURI,
    carSpeedCheckEnabled,
    carSpeedCheckURI,
  } = JSON.parse(providerInfo)

  const [earThresholdVal, setEarThreshold] = useState(earThreshold)
  const [maxFPSVal, setMaxFPS] = useState(maxFPS)
  const [frameLookbackVal, setFrameLookback] = useState(frameLookback)
  const [sendAlertToEnabledVal, setSendAlertToEnabled] = useState(
    sendAlertToEnabled
  )
  const [sendAlertToURIVal, setSendAlertToURI] = useState(sendAlertToURI)
  const [carSpeedCheckEnabledVal, setCarSpeedCheckEnabled] = useState(
    carSpeedCheckEnabled
  )
  const [carSpeedCheckURIVal, setCarSpeedCheckURI] = useState(carSpeedCheckURI)

  useEffect(() => {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        earThreshold: earThresholdVal,
        maxFPS: maxFPSVal,
        frameLookback: frameLookbackVal,
        sendAlertToEnabled: sendAlertToEnabledVal,
        sendAlertToURI: sendAlertToURIVal,
        carSpeedCheckEnabled: carSpeedCheckEnabledVal,
        carSpeedCheckURIVal: carSpeedCheckURIVal,
      })
    )
  }, [
    earThresholdVal,
    maxFPSVal,
    frameLookbackVal,
    sendAlertToEnabledVal,
    sendAlertToURIVal,
    carSpeedCheckEnabledVal,
    carSpeedCheckURIVal,
  ])

  const resetSettings = () => {
    localStorage.removeItem('settings')

    const {
      earThreshold,
      maxFPS,
      frameLookback,
      sendAlertToEnabled,
      sendAlertToURI,
      carSpeedCheckEnabled,
      carSpeedCheckURI,
    } = defaultValues

    setEarThreshold(earThreshold)
    setMaxFPS(maxFPS)
    setFrameLookback(frameLookback)
    setSendAlertToEnabled(sendAlertToEnabled)
    setSendAlertToURI(sendAlertToURI)
    setCarSpeedCheckEnabled(carSpeedCheckEnabled)
    setCarSpeedCheckURI(carSpeedCheckURI)
  }

  return (
    <SettingsContext.Provider
      value={{
        // Getters
        earThreshold: earThresholdVal,
        maxFPS: maxFPSVal,
        frameLookback: frameLookbackVal,
        sendAlertToEnabled: sendAlertToEnabledVal,
        sendAlertToURI: sendAlertToURIVal,
        carSpeedCheckEnabled: carSpeedCheckEnabledVal,
        carSpeedCheckURI: carSpeedCheckURIVal,
        // Setters
        setEarThreshold,
        setMaxFPS,
        setFrameLookback,
        setSendAlertToEnabled,
        setSendAlertToURI,
        setCarSpeedCheckEnabled,
        setCarSpeedCheckURI,
        // Misc
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettingsInfo = () => useContext(SettingsContext)
