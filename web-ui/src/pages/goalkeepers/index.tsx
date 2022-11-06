import React from 'react'
import GoalkeepersList from '../../containers/goalkeepersList'
import PortalPage from '../../containers/portalPage'
import GoalkeepersProvider from '../../contexts/goalkeepersContext'

function Goalkeepers() {
  return (
    <GoalkeepersProvider>
      <PortalPage>
        <GoalkeepersList />
      </PortalPage>
    </GoalkeepersProvider>
  )
}

export default Goalkeepers