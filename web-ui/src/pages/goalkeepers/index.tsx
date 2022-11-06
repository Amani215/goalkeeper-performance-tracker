import React, { useState } from 'react'
import GoalkeepersList from '../../containers/goalkeepersList'
import NewGoalkeeper from '../../containers/modals/newGoalkeeper'
import PortalPage from '../../containers/portalPage'
import GoalkeepersProvider from '../../contexts/goalkeepersContext'

function Goalkeepers() {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

  const handleOpen = () => setModalIsOpen(true)
  const handleClose = () => setModalIsOpen(false)

  return (
    <GoalkeepersProvider>
      <NewGoalkeeper {...{ modalIsOpen, setModalIsOpen: handleClose }} />

      <PortalPage>
        <GoalkeepersList {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
      </PortalPage>
    </GoalkeepersProvider>
  )
}

export default Goalkeepers