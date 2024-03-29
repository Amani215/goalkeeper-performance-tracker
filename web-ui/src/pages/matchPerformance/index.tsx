import React, { useState } from 'react'
import MatchPerformance from '../../containers/matchPerformance'
import UpdateFeedback from '../../containers/modals/updateFeedback'
import PortalPage from '../../containers/portalPage'
import GoalkeeperProvider from '../../contexts/goalkeeperContext'
import MatchPerformanceProvider from '../../contexts/matchPerformanceContext'
import ParamsProvider from '../../contexts/paramsContext'

function MatchPerformancePage() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)
    return (
        <PortalPage>
            <MatchPerformanceProvider>
                <UpdateFeedback {...{ modalIsOpen: modalIsOpen, setModalIsOpen: handleClose }} />

                <GoalkeeperProvider>
                    <ParamsProvider>
                        <MatchPerformance {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
                    </ParamsProvider>
                </GoalkeeperProvider>
            </MatchPerformanceProvider>
        </PortalPage>
    )
}

export default MatchPerformancePage