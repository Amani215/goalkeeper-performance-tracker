import PortalPage from '../../containers/portalPage'
import UsersList from '../../containers/usersList'
import UsersProvider from '../../contexts/usersContext'

const Users = () => {
  return (
    <PortalPage>
      <UsersProvider>
        <UsersList />
      </UsersProvider>
    </PortalPage>
  )
}

export default Users