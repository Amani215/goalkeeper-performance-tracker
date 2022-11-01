import { useParams } from 'react-router-dom';
import PortalPage from '../../containers/portalPage'

function User() {
    const { id } = useParams();

    return (
        <PortalPage>
            {id}
        </PortalPage>
    )
}

export default User