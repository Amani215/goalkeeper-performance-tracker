import { useState } from 'react'
import NewUser from '../../containers/modals/newUser'
import PortalPage from '../../containers/portalPage'
import UsersList from '../../containers/usersList'
import UserProvider from '../../contexts/userContext'
import UsersProvider from '../../contexts/usersContext'

const Users = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

  const handleOpen = () => setModalIsOpen(true)
  const handleClose = () => setModalIsOpen(false)
  return (
    <>
      <UserProvider>
        <NewUser {...{ modalIsOpen, setModalIsOpen: handleClose }} />
      </UserProvider>

      <PortalPage>
        <UsersProvider>
          <UsersList {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
        </UsersProvider>
      </PortalPage>
    </>
  )
}

export default Users