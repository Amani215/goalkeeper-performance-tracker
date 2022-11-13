import React from 'react'
import MatchDetails from '../../containers/matchDetails'
import PortalPage from '../../containers/portalPage'
import MatchProvider from '../../contexts/matchContext'

function Match() {
    return (
        <PortalPage>
            <MatchProvider>
                <MatchDetails />
            </MatchProvider>
        </PortalPage>
    )
}

export default Match