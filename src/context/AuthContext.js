// ** React Imports
import { createContext, useEffect, useState, useCallback } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('tradeVenddor') : null

    return storedUser ? JSON.parse(storedUser) : defaultProvider.user
  })
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  const initAuth = useCallback(async () => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem(authConfig.storageTokenKeyName) : null

    if (storedToken) {
      setLoading(true)
      try {
        const response = await axios.get(authConfig.meEndpoint, {
          headers: {
            Authorization: storedToken
          }
        })
        setUser({ ...response.data.userData })
      } catch {
        localStorage.removeItem('tradeVenddor')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
        setUser(null)
        if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
          router.replace('/login')
        }
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  const handleLogin = useCallback(
    async (params, errorCallback) => {
      try {
        const response = await axios.post(authConfig.loginEndpoint, params)
        if (params.rememberMe) {
          window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          // window.localStorage.setItem('tradeVenddor', JSON.stringify(response.data.tradeVenddor))
        }
        // setUser({ ...response.data.tradeVenddor })
        const returnUrl = router.query.returnUrl || '/'
        router.replace(returnUrl !== '/' ? returnUrl : '/')
      } catch (err) {
        if (errorCallback) errorCallback(err)
      }
    },
    [router]
  )

  const handleLogout = useCallback(() => {
    setUser(null)
    window.localStorage.removeItem('tradeVenddor')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }, [router])

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
