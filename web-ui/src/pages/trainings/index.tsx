import { GrafanaPanel } from '../../components/grafana'
import PortalPage from '../../containers/portalPage'

function Trainings() {
    return (
        <PortalPage>
            <GrafanaPanel src={'http://localhost/grafana/d-solo/qeVBDKdVf/trainings?from=1667257200000&to=1669849199999&orgId=1&panelId=12'} xs={12} height={600} />
        </PortalPage>
    )
}

export default Trainings