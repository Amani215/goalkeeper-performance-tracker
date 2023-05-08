import React, { useState } from 'react'
import GoalkeeperDetails from '../../containers/goalkeeperDetails'
import PortalPage from '../../containers/portalPage'
import GoalkeeperProvider from '../../contexts/goalkeeperContext'
import GrowthProvider from '../../contexts/growthContext'
import UpdateGoalkeeper from '../../containers/modals/updateGoalkeeper'

function Goalkeeper() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)

    return (
        <PortalPage>
            <GoalkeeperProvider>
                <UpdateGoalkeeper {...{ modalIsOpen, setModalIsOpen: handleClose }} />

                <GrowthProvider>
                    <GoalkeeperDetails {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
                </GrowthProvider>
            </GoalkeeperProvider>
        </PortalPage>
    )
}

export default Goalkeeper