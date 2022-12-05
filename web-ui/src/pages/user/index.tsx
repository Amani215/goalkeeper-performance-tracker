import { useState } from 'react';
import UpdateUser from '../../containers/modals/updateUser';
import PortalPage from '../../containers/portalPage'
import UserDetails from '../../containers/userDetails';
import UserProvider from '../../contexts/userContext';

function User() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)
    return (
        <PortalPage>
            <UserProvider>
                <UpdateUser {...{ modalIsOpen, setModalIsOpen: handleClose }} />

                <UserDetails {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
            </UserProvider>
        </PortalPage>
    )
}

export default User