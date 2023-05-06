import dynamic from 'next/dynamic'
import Address from './Address'
import AddressView from './AddressView'
import Avatar from './Avatar'
import Banner from './Banner'
import Button from './Button'
import Card from './Card'
import Code from './Code'
import Comments from './Comments'
import ConnectButton from './ConnectButton'
import ContractView, { Files } from './ContractView'
import Copy from './Copy'
import DataTable from './DataTable'
import DateTime from './DateTime'
import Delta from './Delta'
import Details from './Details'
import DetailsView from './DetailsView'
import Empty from './Empty'
import Grid from './Grid'
import Heading from './Heading'
import Label from './Label'
import Loading, { LoadingCard } from './Loading'
import Logo from './Logo'
import Message from './Message'
import OutsideClicker from './OutsideClicker'
import Page from './Page'
import { Pagination } from './Pagination'
import Properties from './Properties'
import Search from './Search'
import Separated from './Separated'
import Summary from './Summary'
import { BlockOverview, TxLogs, TxOverview, TxTrace } from './TabContent'
import TabPanel from './TabPanel'
import { Table } from './Table'
import Tile from './Tile'
import Value from './Value'
import IconDown from '@/images/icons/arrow-down.svg'
import IconLeft from '@/images/icons/arrow-left.svg'
import IconRight from '@/images/icons/arrow-right.svg'
import IconContract from '@/images/icons/contract.svg'
import IconCross from '@/images/icons/cross.svg'
import IconLiquidityPool from '@/images/icons/liquidity-pool.svg'
import IconEmpty from '@/images/icons/no-flash.svg'
import IconQuestion from '@/images/icons/question.svg'
import IconWatch from '@/images/icons/stop-watch.svg'
import IconVerify from '@/images/icons/verified.svg'
import IconWallet from '@/images/icons/wallet.svg'

const TimeAgo = dynamic(() => import('./TimeAgo'), { ssr: false })
const LineChart = dynamic(() => import('./LineChart'), { ssr: false })

export {
  Address,
  AddressView,
  Avatar,
  Banner,
  Button,
  BlockOverview,
  Card,
  Code,
  Copy,
  ConnectButton,
  Comments,
  ContractView,
  DataTable,
  DateTime,
  Delta,
  Details,
  DetailsView,
  Empty,
  Files,
  Grid,
  Heading,
  Loading,
  LoadingCard,
  Label,
  LineChart,
  Logo,
  Message,
  OutsideClicker,
  Page,
  Pagination,
  Properties,
  Separated,
  Summary,
  Search,
  Table,
  TabPanel,
  Tile,
  TimeAgo,
  Value,
  IconLeft,
  IconRight,
  IconCross,
  IconDown,
  IconEmpty,
  IconWatch,
  IconWallet,
  IconContract,
  IconVerify,
  IconLiquidityPool,
  IconQuestion,
  TxOverview,
  TxLogs,
  TxTrace,
}
