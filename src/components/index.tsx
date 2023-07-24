import dynamic from 'next/dynamic'
import Address from './Address'
import AddressView from './AddressView'
import AddressWallet from './AddressWallet'
import Avatar from './Avatar'
import Banner from './Banner'
import Button from './Button'
import Card from './Card'
import Code from './Code'
import Comments from './Comments'
import CommonChart from './CommonChart'
import ConnectButton from './ConnectButton'
import ContractView, { Files } from './ContractView'
import Copy from './Copy'
import Dashboard from './Dashboard'
import DataTable from './DataTable'
import DateTime from './DateTime'
import Delta from './Delta'
import Details from './Details'
import DetailsView from './DetailsView'
import Grid from './Grid'
import Heading from './Heading'
import Label from './Label'
import Loading, { LoadingCard } from './Loading'
import Logo from './Logo'
import { LogsView } from './LogsView'
import Message from './Message'
import NetworkSelect from './NetworkSelect'
import OpenWith from './OpenWith'
import OutsideClicker from './OutsideClicker'
import Page from './Page'
import { Pagination } from './Pagination'
import { PerPageSelector } from './PerPageSelector'
import PieChart from './PieChart'
import Properties from './Properties'
import Search from './Search'
import Separated from './Separated'
import Socials from './Socials'
import StateView from './StateView'
import Summary from './Summary'
import { BlockOverview, TxLogs, TxOverview, TxTrace } from './TabContent'
import TabPanel from './TabPanel'
import { Table } from './Table'
import Tabs from './Tabs'
import Tile from './Tile'
import TooltipAnchor from './TooltipAnchor'
import Trace from './Trace'
import Value from './Value'
import IconDown from '@/images/icons/arrow-down.svg'
import IconArrowDown from '@/images/icons/arrow-down.svg'
import IconLeft from '@/images/icons/arrow-left.svg'
import IconRight from '@/images/icons/arrow-right.svg'
import IconBlock from '@/images/icons/block.svg'
import IconChart from '@/images/icons/chart.svg'
import IconContract from '@/images/icons/contract.svg'
import IconCross from '@/images/icons/cross.svg'
import IconLiquidityPool from '@/images/icons/liquidity-pool.svg'
import IconMenu from '@/images/icons/menu.svg'
import IconNoData from '@/images/icons/no-data.svg'
import IconEmpty from '@/images/icons/no-flash.svg'
import IconNoIcon from '@/images/icons/no-icon.svg'
import IconQuestion from '@/images/icons/question.svg'
import IconSearch from '@/images/icons/search.svg'
import IconShield from '@/images/icons/shield.svg'
import IconWatch from '@/images/icons/stop-watch.svg'
import IconTx from '@/images/icons/tx.svg'
import IconVerify from '@/images/icons/verified.svg'
import IconWallet from '@/images/icons/wallet.svg'

const TimeAgo = dynamic(() => import('./TimeAgo'), { ssr: false })
const Tooltip = dynamic(() => import('./Tooltip'), { ssr: false })

export {
  Copy,
  Address,
  AddressView,
  AddressWallet,
  Avatar,
  Banner,
  Button,
  BlockOverview,
  Card,
  Code,
  ConnectButton,
  Comments,
  ContractView,
  Dashboard,
  DataTable,
  DateTime,
  Delta,
  Details,
  DetailsView,
  StateView,
  Files,
  Grid,
  Heading,
  Loading,
  LoadingCard,
  Label,
  CommonChart,
  PieChart,
  Tabs,
  Logo,
  Message,
  NetworkSelect,
  OutsideClicker,
  OpenWith,
  Page,
  Pagination,
  PerPageSelector,
  Properties,
  Separated,
  Summary,
  Socials,
  Search,
  Table,
  TabPanel,
  Tile,
  TimeAgo,
  TooltipAnchor,
  Value,
  IconLeft,
  IconRight,
  IconChart,
  IconCross,
  IconDown,
  IconEmpty,
  IconWatch,
  IconWallet,
  IconContract,
  IconVerify,
  IconShield,
  IconLiquidityPool,
  IconQuestion,
  IconNoIcon,
  IconBlock,
  IconTx,
  IconMenu,
  IconNoData,
  IconSearch,
  TxOverview,
  TxLogs,
  Tooltip,
  TxTrace,
  IconArrowDown,
  LogsView,
  Trace,
}
