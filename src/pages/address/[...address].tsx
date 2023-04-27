import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { canto } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { TransactionModel } from '@/__generated__/resolvers-types'
import { ContractView, AddressView } from '@/components'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_TRANSACTIONS } from '@/lib/apollo/queries'

const { chains, provider } = configureChains([canto], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'Block Explorer',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

interface AddressPageServerProps {
  isContract: string
  transactions?: TransactionModel[]
}

const AddressPage: NextPage<AddressPageServerProps> = ({
  isContract,
  transactions,
}) => {
  const router = useRouter()
  const { address, tab } = router.query

  if (!address) {
    return null
  }

  // if it is a contract - fetch metadata and files from sourcify
  const normalizedAddress = Array.isArray(address) ? address[0] : address

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {isContract ? (
          <ContractView
            address={normalizedAddress}
            tab={tab}
            transactions={transactions}
          />
        ) : (
          <AddressView
            address={normalizedAddress}
            tab={tab}
            transactions={transactions}
          />
        )}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default AddressPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const address = ctx.resolvedUrl.split('?')[0].split('/').pop()
  const tab = ctx.resolvedUrl.split('?')[1]
  // Fetch data from external API
  const url = `https://sourcify.dev/server/check-all-by-addresses?addresses=${address}&chainIds=7700`
  const res = await fetch(url)
  const data = await res.json()

  const isContract = data[0].status !== 'false'
  let result = { props: { isContract } }
  // transactions tab
  if (tab === undefined) {
    const apolloClient = initializeApollo({ ctx })

    const { data: transactions } = await apolloClient.query({
      query: GET_TRANSACTIONS,
      variables: { first: 10, skip: 0, address },
    })

    const transactionsProps = addApolloState(apolloClient, {
      props: { ...transactions },
    })

    result = { ...result, ...transactionsProps }
  }

  // Pass data to the page via props
  return result
}
