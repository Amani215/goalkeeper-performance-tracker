import { useState } from 'react'
import NewUser from '../../containers/modals/newUser'
import PortalPage from '../../containers/portalPage'
import UsersList from '../../containers/usersList'
import UsersProvider from '../../contexts/usersContext'

const Users = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

  const handleOpen = () => setModalIsOpen(true)
  const handleClose = () => setModalIsOpen(false)
  return (
    <UsersProvider>
      <NewUser {...{ modalIsOpen, setModalIsOpen: handleClose }} />

      <PortalPage>
        <UsersList {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
      </PortalPage>
    </UsersProvider>
  )
}

export default Users