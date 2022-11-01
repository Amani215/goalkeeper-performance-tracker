import { useParams } from 'react-router-dom';
import PortalPage from '../../containers/portalPage'
import UserProfile from '../../containers/userProfile';

function User() {
    const { id } = useParams();

    return (
        <PortalPage>
            <UserProfile />
        </PortalPage>
    )
}

export default User