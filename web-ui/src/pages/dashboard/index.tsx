import { GrafanaDashboard } from '../../components/grafana'
import PortalPage from '../../containers/portalPage'
import UserProvider from '../../contexts/userContext'

const Dashboard = () => {
  return (
    <UserProvider>
      <PortalPage>
        <GrafanaDashboard src={`${process.env.REACT_APP_GRAFANA_ENDPOINT}/d/mainLite/main-dashboard?orgId=1&from=1667257200000&to=1669849199999&kiosk`} xs={0} height={700} />
      </PortalPage>
    </UserProvider>
  )
}

export default Dashboard