import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { canto } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ContractView, AddressView } from '@/components'

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
}

const AddressPage: NextPage<AddressPageServerProps> = ({ isContract }) => {
  const router = useRouter()
  const { address, tab } = router.query
  console.log('isContract', isContract)

  if (!address) {
    return null
  }

  // if it is a contract - fetch metadata and files from sourcify
  const normalizedAddress = Array.isArray(address) ? address[0] : address

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {isContract ? (
          <ContractView address={normalizedAddress} tab={tab} />
        ) : (
          <AddressView address={normalizedAddress} tab={tab} />
        )}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default AddressPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const address = ctx.resolvedUrl.split('?')[0].split('/').pop()
  // Fetch data from external API
  const url = `https://sourcify.dev/server/check-all-by-addresses?addresses=${address}&chainIds=7700`
  const res = await fetch(url)
  const data = await res.json()

  console.log(data)
  const isContract = data[0].status !== 'false'

  // Pass data to the page via props
  return { props: { isContract } }
}
