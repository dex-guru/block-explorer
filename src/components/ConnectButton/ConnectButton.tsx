import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button from '@/components/Button'
import styles from './ConnectButton.module.scss'

const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    icon={'🔴'}
                    caption="Connect to Web3"
                    onClick={openConnectModal}
                    className={styles.button}
                  />
                )
              }
              if (chain.unsupported) {
                return (
                  <Button
                    icon={'🔴'}
                    caption="Wrong network"
                    onClick={openChainModal}
                    className={styles.button}
                  />
                )
              }
              return (
                <Button
                  icon={'🟢'}
                  caption="Connected - Web3"
                  onClick={openAccountModal}
                  className={styles.button}
                />
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default CustomConnectButton
