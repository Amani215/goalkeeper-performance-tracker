import React from 'react'
import MatchPerformance from '../../containers/matchPerformance'
import PortalPage from '../../containers/portalPage'
import GoalkeeperProvider from '../../contexts/goalkeeperContext'
import MatchPerformanceProvider from '../../contexts/matchPerformanceContext'

function MatchPerformancePage() {
    return (
        <PortalPage>
            <GoalkeeperProvider>
                <MatchPerformanceProvider>
                    <MatchPerformance />
                </MatchPerformanceProvider>
            </GoalkeeperProvider>
        </PortalPage>
    )
}

export default MatchPerformancePage