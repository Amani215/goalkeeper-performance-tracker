import React from 'react'
import PortalPage from '../../containers/portalPage'
import TrainingDetails from '../../containers/trainingDetails'
import TrainingProvider from '../../contexts/trainingContext'

function Training() {
    return (
        <PortalPage>
            <TrainingProvider>
                <TrainingDetails />
            </TrainingProvider>
        </PortalPage>
    )
}

export default Training