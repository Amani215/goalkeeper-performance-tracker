import { GrafanaDashboard } from '../../components/grafana'
import PortalPage from '../../containers/portalPage'

const Dashboard = () => {
  return (
    <PortalPage>
      <GrafanaDashboard src={'http://localhost/grafana/d/mainLite/main-dashboard?orgId=1&from=1667257200000&to=1669849199999&kiosk'} xs={0} height={700} />
    </PortalPage>
  )
}

export default Dashboard