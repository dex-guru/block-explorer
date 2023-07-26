import { FC } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import '@rainbow-me/rainbowkit/styles.css'
import { Abi, AbiFunction } from 'abitype'
import Card from '@/components/Card'
import Message from '@/components/Message'
import TabPanel from '@/components/TabPanel'
import { Match } from '@/types'
import tabsStyles from '@/components/Tabs/Tabs.module.scss'

const Files = dynamic(() => import('./Files'))
const ContractMethodForm = dynamic(() => import('./ContractMethodForm'))
const ContractProperty = dynamic(() => import('./ContractProperty'))
const ConnectButton = dynamic(() => import('@/components/ConnectButton'))

const ContractTab: FC<{
  match?: Match | null
  address: string
  tab: string
}> = ({ match, tab, address }) => {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]

  const isMatchLoading = match === undefined

  const abi = (match?.metadata?.output?.abi as Abi) || undefined

  const hasSources = !!match?.metadata?.sources

  const contractTabs = [
    {
      title: 'Code',
      value: 'code',
      to: `${pathname}?tab=code`,
    },
  ]

  if (abi) {
    contractTabs.push(
      {
        title: 'Read Contract',
        value: 'readContract',
        to: `${pathname}?tab=readContract`,
      },
      {
        title: 'Write Contract',
        value: 'writeContract',
        to: `${pathname}?tab=writeContract`,
      }
    )
  }

  return (
    <Card>
      {!isMatchLoading && !hasSources && abi && (
        <>
          <Message type="danger">
            This smart contract is not verified according to{' '}
            <Link
              href="https://sourcify.dev/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Sourcify
            </Link>
            . Make sure you understand the risks of interacting with unverified
            smart contracts.
          </Message>
          <Message type="info">
            As a contract owner, you can get your smart contract verified with
            Sourcify{' '}
            <Link
              href="/verifyContract"
              rel="noopener noreferrer"
              target="_blank"
            >
              here
            </Link>
            .
          </Message>
        </>
      )}

      <TabPanel
        tabsClassName={tabsStyles.inner}
        tabs={contractTabs}
        value={tab}
      >
        {abi && ['readContract', 'writeContract'].includes(tab as string) && (
          <ConnectButton />
        )}

        {(tab === 'code' || !abi) && <Files match={match} address={address} />}

        {['readContract', 'writeContract'].includes(tab as string) && (
          <>
            {tab === 'readContract' && (
              <>
                {!!abi &&
                  (abi as Abi)
                    .filter(
                      (item) =>
                        item.type === 'function' &&
                        item.stateMutability === 'view'
                    )
                    .map((method, index) => {
                      const contractMethod = method as AbiFunction & {
                        type: 'function'
                      }
                      return contractMethod.inputs.length === 0 ? (
                        <ContractProperty
                          key={`${index}-${contractMethod}`}
                          method={contractMethod}
                          address={address}
                          abi={abi}
                        />
                      ) : (
                        <ContractMethodForm
                          key={`${index}-${contractMethod}`}
                          method={contractMethod}
                          address={address}
                          abi={abi}
                        />
                      )
                    })}
              </>
            )}

            {tab === 'writeContract' && (
              <>
                {!!abi &&
                  (abi as Abi)
                    .filter(
                      (item) =>
                        item.type === 'function' &&
                        (item.stateMutability === 'nonpayable' ||
                          item.stateMutability === 'payable')
                    )
                    .map((method, index) => {
                      const contractMethod = method as AbiFunction & {
                        type: 'function'
                      }
                      return (
                        <ContractMethodForm
                          key={`${index}-${contractMethod}`}
                          method={contractMethod}
                          address={address}
                          abi={abi}
                          isWrite
                        />
                      )
                    })}
              </>
            )}
          </>
        )}
      </TabPanel>
    </Card>
  )
}

export default ContractTab
