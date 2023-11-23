import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AuthenticationStatus,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from '@rainbow-me/rainbowkit'
import { AuthenticationAdapter } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/AuthenticationContext'
import '@rainbow-me/rainbowkit/styles.css'
import { loginRequest } from '@telekomconsalting/dex-guru-internal-sdk/lib/adapters/apiAuthAdapter'
import { refreshToken } from '@telekomconsalting/dex-guru-internal-sdk/lib/services/authService'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'
import { SiweMessage } from 'siwe'
import { useAccount } from 'wagmi'
import {
  AUTH_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
  dexGuruLoginApiV2Url,
  dexGuruLoginApiV3Url,
  JWT_TOKEN_REFRESH_INTERVAL,
  LocalStorageKeyEnum,
} from '../constants'
import { getRootDomain, sleep } from '@/lib/utils'

export const SUCCESS_AUTH_EVENT = 'SUCCESS_AUTH_EVENT'

const RainbowKitAuthWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<AuthenticationStatus>('unauthenticated')
  const { address: account, connector } = useAccount()
  const accountRef = useRef(account)

  const tokenRefresh = useCallback((): void => {
    refreshToken(dexGuruLoginApiV2Url).then(({ error, accessToken, refreshToken }) => {
      if (error) {
        setStatus('unauthenticated')
        throw new Error(error)
      }
      if (account && accessToken && refreshToken) {
        setStatus('authenticated')
        localStorage.setItem(LocalStorageKeyEnum.access_token, accessToken)
        const accessDecoded = jwt_decode(accessToken) as { exp: number }
        Cookies.set(AUTH_COOKIE_NAME, accessToken, {
          domain: getRootDomain(window.location.host) || undefined,
          expires: new Date(accessDecoded?.exp * 1000),
        })

        localStorage.setItem(LocalStorageKeyEnum.refresh_token, refreshToken)
        const refreshDecoded = jwt_decode(refreshToken) as { exp: number }
        Cookies.set(AUTH_REFRESH_COOKIE_NAME, refreshToken, {
          domain: getRootDomain(window.location.host) || undefined,
          expires: new Date(refreshDecoded?.exp * 1000),
        })
      }
    })
  }, [account])

  useEffect(() => {
    const accessToken = localStorage.getItem(LocalStorageKeyEnum.access_token)

    if (!accessToken) {
      setStatus('unauthenticated')
      return
    }

    const decoded = jwt_decode(accessToken) as { exp: number }
    const now = new Date().valueOf()
    const exp = decoded?.exp || 0

    if (exp * 1000 > now) {
      account && setStatus('authenticated')
    } else {
      localStorage.removeItem(LocalStorageKeyEnum.access_token)
      Cookies.remove(AUTH_COOKIE_NAME)
      tokenRefresh()
    }

    const refreshTimer = setInterval(tokenRefresh, JWT_TOKEN_REFRESH_INTERVAL)

    return (): void => {
      clearInterval(refreshTimer)
    }
  }, []) // did mount effect

  useEffect(() => {
    accountRef.current = account
  }, [account])

  const authenticationAdapter: AuthenticationAdapter<SiweMessage> = useMemo(
    () =>
      createAuthenticationAdapter({
        getNonce: async (): Promise<string> => {
          if (!accountRef.current) {
            // when you disconnect and then immediately connect again, account isn't resolved yet
            // and the error is thrown. so we need to wait a bit
            await sleep(500)
            return await authenticationAdapter.getNonce()
          }
          const response = await loginRequest(dexGuruLoginApiV3Url, accountRef.current)
          return response.nonce || ''
        },
        createMessage: ({ nonce, address, chainId }) => {
          return new SiweMessage({
            domain: window.location.host,
            address,
            statement: 'Sign in with Ethereum to the app.',
            uri: window.location.origin,
            version: '1',
            chainId,
            nonce,
          })
        },
        getMessageBody: ({ message }) => {
          return message.nonce
        },
        verify: async ({ message, signature }: { message: SiweMessage; signature: string }) => {
          const accountId = localStorage.getItem(LocalStorageKeyEnum.account_id) || undefined
          if (!accountRef.current) {
            // when you disconnect and then immediately connect again, account isn't resolved yet
            // and the error is thrown. so we need to wait a bit
            await sleep(500)
            return await authenticationAdapter.verify({ message, signature })
          }
          const nonce = message.nonce
          const response = await loginRequest(
            dexGuruLoginApiV3Url,
            accountRef.current,
            accountId,
            nonce,
            signature
          )
          const { access_token, refresh_token, account_id } = await response
          account_id && localStorage.setItem(LocalStorageKeyEnum.account_id, account_id)

          localStorage.setItem(LocalStorageKeyEnum.access_token, access_token)
          const accessDecoded = jwt_decode(access_token) as { exp: number }
          Cookies.set(AUTH_COOKIE_NAME, access_token, {
            domain: getRootDomain(window.location.host) || undefined,
            expires: new Date(accessDecoded?.exp * 1000),
          })

          localStorage.setItem(LocalStorageKeyEnum.refresh_token, refresh_token)
          const refreshDecoded = jwt_decode(refresh_token) as { exp: number }
          Cookies.set(AUTH_REFRESH_COOKIE_NAME, refresh_token, {
            domain: getRootDomain(window.location.host) || undefined,
            expires: new Date(refreshDecoded?.exp * 1000),
          })

          const status = access_token ? 'authenticated' : 'unauthenticated'
          setStatus(status)
          document.dispatchEvent(new Event(SUCCESS_AUTH_EVENT))
          return Boolean(access_token)
        },
        signOut: async () => {
          localStorage.removeItem(LocalStorageKeyEnum.account_id)
          localStorage.removeItem(LocalStorageKeyEnum.access_token)
          Cookies.remove(AUTH_COOKIE_NAME)
          localStorage.removeItem(LocalStorageKeyEnum.refresh_token)
          Cookies.remove(AUTH_REFRESH_COOKIE_NAME)
          setStatus('unauthenticated')
        },
      }),
    [connector]
  )
  return (
    <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  )
}

export default RainbowKitAuthWrapper
