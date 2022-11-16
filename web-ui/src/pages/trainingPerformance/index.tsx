import React, { useState } from 'react'
import PortalPage from '../../containers/portalPage'
import TrainingPerformance from '../../containers/trainingPerformance'
import GoalkeeperProvider from '../../contexts/goalkeeperContext'
import TrainingPerformanceProvider from '../../contexts/trainingPerformanceContext'
import UpdateTrainingFeedback from '../../containers/modals/updateTrainingFeedback'


function TrainingPerformancePage() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)

    return (
        <PortalPage>
            <TrainingPerformanceProvider>
                <UpdateTrainingFeedback {...{ modalIsOpen: modalIsOpen, setModalIsOpen: handleClose }} />

                <GoalkeeperProvider>
                    <TrainingPerformance  {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
                </GoalkeeperProvider>
            </TrainingPerformanceProvider>
        </PortalPage>
    )
}

export default TrainingPerformancePage