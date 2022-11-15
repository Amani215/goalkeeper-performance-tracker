import React from 'react'
import MatchPerformance from '../../containers/matchPerformance'
import PortalPage from '../../containers/portalPage'
import MatchPerformanceProvider from '../../contexts/matchPerformanceContext'

function MatchPerformancePage() {
    return (
        <PortalPage>
            <MatchPerformanceProvider>
                <MatchPerformance />
            </MatchPerformanceProvider>
        </PortalPage>
    )
}

export default MatchPerformancePage