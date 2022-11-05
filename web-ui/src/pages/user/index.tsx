import PortalPage from '../../containers/portalPage'
import UserDetails from '../../containers/userDetails';
import UserProvider from '../../contexts/userContext';

function User() {
    return (
        <PortalPage>
            <UserProvider>
                <UserDetails />
            </UserProvider>
        </PortalPage>
    )
}

export default User