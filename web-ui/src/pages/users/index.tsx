import { useState } from 'react'
import NewUser from '../../components/newUser'
import PortalPage from '../../containers/portalPage'
import UsersList from '../../containers/usersList'
import UsersProvider from '../../contexts/usersContext'

const Users = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

  const handleOpen = () => setModalIsOpen(true)
  const handleClose = () => setModalIsOpen(false)
  return (
    <>
      <NewUser {...{ modalIsOpen, setModalIsOpen: handleClose }} />
      <PortalPage>
        <UsersProvider>
          <UsersList {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
        </UsersProvider>
      </PortalPage>
    </>
  )
}

export default Users