import React from 'react'
import PortalPage from '../../containers/portalPage'
import TrainingPerformance from '../../containers/trainingPerformance'
import GoalkeeperProvider from '../../contexts/goalkeeperContext'
import TrainingPerformanceProvider from '../../contexts/trainingPerformanceContext'

function TrainingPerformancePage() {
    return (
        <PortalPage>
            <TrainingPerformanceProvider>
                <GoalkeeperProvider>
                    <TrainingPerformance />
                </GoalkeeperProvider>
            </TrainingPerformanceProvider>
        </PortalPage>
    )
}

export default TrainingPerformancePage