// ** React Imports
import { createContext, useState, useEffect } from 'react'
import _ from 'lodash' // Import lodash for debounce functionality

// ** ThemeConfig Import
import themeConfig from 'src/configs/themeConfig'

const initialSettings = {
  themeColor: 'primary',
  mode: themeConfig.mode,
  skin: themeConfig.skin,
  footer: themeConfig.footer,
  layout: themeConfig.layout,
  lastLayout: themeConfig.layout,
  direction: themeConfig.direction,
  navHidden: themeConfig.navHidden,
  appBarBlur: themeConfig.appBarBlur,
  navCollapsed: themeConfig.navCollapsed,
  contentWidth: themeConfig.contentWidth,
  toastPosition: themeConfig.toastPosition,
  verticalNavToggleType: themeConfig.verticalNavToggleType,
  appBar: themeConfig.layout === 'horizontal' && themeConfig.appBar === 'hidden' ? 'fixed' : themeConfig.appBar
}

const staticSettings = {
  appBar: initialSettings.appBar,
  footer: initialSettings.footer,
  layout: initialSettings.layout,
  navHidden: initialSettings.navHidden,
  lastLayout: initialSettings.lastLayout,
  toastPosition: initialSettings.toastPosition
}

const restoreSettings = () => {
  if (typeof window === 'undefined') {
    // Return initial settings during server-side rendering
    return initialSettings
  }

  let settings = null
  try {
    const storedData = window.localStorage.getItem('settings')
    if (storedData) {
      settings = { ...JSON.parse(storedData), ...staticSettings }
    } else {
      settings = initialSettings
    }
  } catch (err) {
    console.error(err)
  }

  return settings
}

// set settings in localStorage
const storeSettings = settings => {
  if (typeof window === 'undefined') {
    return // Do nothing if we're on the server
  }

  const initSettings = Object.assign({}, settings)
  delete initSettings.appBar
  delete initSettings.footer
  delete initSettings.layout
  delete initSettings.navHidden
  delete initSettings.lastLayout
  delete initSettings.toastPosition
  window.localStorage.setItem('settings', JSON.stringify(initSettings))
}

// ** Create Context
export const SettingsContext = createContext({
  saveSettings: () => null,
  settings: initialSettings
})

export const SettingsProvider = ({ children, pageSettings }) => {
  // ** State with lazy initialization
  const [settings, setSettings] = useState(() => {
    const restoredSettings = restoreSettings()

    return restoredSettings || initialSettings
  })

  // ** Debounced store settings to reduce frequent writes
  const bufferedStoreSettings = useCallback(
    _.debounce(settings => {
      storeSettings(settings)
    }, 300), // Adjust debounce delay as needed
    []
  )

  // ** Save settings with debounce and memoization
  const saveSettings = useCallback(
    updatedSettings => {
      if (JSON.stringify(updatedSettings) !== JSON.stringify(settings)) {
        bufferedStoreSettings(updatedSettings)
        setSettings(updatedSettings)
      }
    },
    [settings, bufferedStoreSettings]
  )

  useEffect(() => {
    const restoredSettings = restoreSettings()
    if (restoredSettings && JSON.stringify(restoredSettings) !== JSON.stringify(settings)) {
      setSettings({ ...restoredSettings })
    }
    if (pageSettings && JSON.stringify(pageSettings) !== JSON.stringify(settings)) {
      setSettings({ ...settings, ...pageSettings })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSettings])

  useEffect(() => {
    if (settings.layout === 'horizontal' && settings.mode === 'semi-dark') {
      saveSettings({ ...settings, mode: 'light' })
    }
    if (settings.layout === 'horizontal' && settings.appBar === 'hidden') {
      saveSettings({ ...settings, appBar: 'fixed' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>
}

export const SettingsConsumer = SettingsContext.Consumer
