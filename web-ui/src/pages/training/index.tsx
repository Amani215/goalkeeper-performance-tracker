import React, { useState } from 'react'
import PortalPage from '../../containers/portalPage'
import TrainingDetails from '../../containers/trainingDetails'
import TrainingProvider from '../../contexts/trainingContext'
import NewTrainingGoalkeeper from '../../containers/modals/newTrainingGoalkeeper'
import GoalkeepersProvider from '../../contexts/goalkeepersContext'
import ParamsProvider from '../../contexts/paramsContext'

function Training() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)
    return (
        <PortalPage>
            <TrainingProvider>
                <GoalkeepersProvider>
                    <NewTrainingGoalkeeper {...{ modalIsOpen, setModalIsOpen: handleClose }} />
                </GoalkeepersProvider>

                <ParamsProvider>
                    <TrainingDetails {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
                </ParamsProvider>
            </TrainingProvider>
        </PortalPage>
    )
}

export default Training