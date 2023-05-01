import dynamic from 'next/dynamic'
import Address from './Address'
import AddressView from './AddressView'
import Avatar from './Avatar'
import Banner from './Banner'
import Button from './Button'
import Card from './Card'
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
import Logo from './Logo'
import Page from './Page'
import Pagination from './Pagination'
import Properties from './Properties'
import Search from './Search'
import Summary from './Summary'
import TabPanel from './TabPanel'
import Table from './Table'
import Tile from './Tile'
import Value from './Value'

const TimeAgo = dynamic(() => import('./TimeAgo'), { ssr: false })

export {
  Address,
  AddressView,
  Avatar,
  Banner,
  Button,
  Card,
  Copy,
  ConnectButton,
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
  Label,
  Logo,
  Page,
  Pagination,
  Properties,
  Summary,
  Search,
  Table,
  TabPanel,
  Tile,
  TimeAgo,
  Value,
}
