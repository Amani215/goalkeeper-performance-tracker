import React from 'react'
import MatchesView from '../../containers/matchesView'
import PortalPage from '../../containers/portalPage'
import MatchesProvider from '../../contexts/matchesContext'

function Matches() {
    return (
        <MatchesProvider>
            <PortalPage>
                <MatchesView />
            </PortalPage>
        </MatchesProvider>
    )
}

export default Matches