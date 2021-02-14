/** @jsx jsx */
import { jsx } from 'theme-ui'
import { createContext, useEffect, useState, useContext } from 'react'


const defaultValues = {
  earThreshold: 0.3,
  maxFPS: 15,
  frameLookback: 50,
  sendAlertToEnabled: false,
  sendAlertToURI: '',
  carSpeedCheckEnabled: false,
  carSpeedCheckURI: '',
  bruhShiJianEnabled: false,
}

const SettingsContext = createContext({})

export const SettingsProvider = ({ children }) => {
  let providerInfo = JSON.stringify(defaultValues)

  if (typeof window !== 'undefined' && localStorage.getItem('settings'))
    providerInfo = localStorage.getItem('settings')

  const {
    earThreshold,
    maxFPS,
    frameLookback,
    sendAlertToEnabled,
    sendAlertToURI,
    carSpeedCheckEnabled,
    carSpeedCheckURI,
    bruhShiJianEnabled,
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
  const [bruhShiJianEnabledVal, setBruhShiJianEnabled] = useState(
    bruhShiJianEnabled
  )

  useEffect(() => {
    if (typeof window !== 'undefined')
      localStorage.setItem(
        'settings',
        JSON.stringify({
          earThreshold: earThresholdVal,
          maxFPS: maxFPSVal,
          frameLookback: frameLookbackVal,
          sendAlertToEnabled: sendAlertToEnabledVal,
          sendAlertToURI: sendAlertToURIVal,
          carSpeedCheckEnabled: carSpeedCheckEnabledVal,
          carSpeedCheckURI: carSpeedCheckURIVal,
          bruhShiJianEnabled: bruhShiJianEnabledVal,
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
    bruhShiJianEnabledVal,
  ])

  const resetSettings = () => {
    if (typeof window !== 'undefined')
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
        bruhShiJianEnabled: bruhShiJianEnabledVal,
        // Setters
        setEarThreshold,
        setMaxFPS,
        setFrameLookback,
        setSendAlertToEnabled,
        setSendAlertToURI,
        setCarSpeedCheckEnabled,
        setCarSpeedCheckURI,
        setBruhShiJianEnabled,
        // Misc
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettingsInfo = () => useContext(SettingsContext)
