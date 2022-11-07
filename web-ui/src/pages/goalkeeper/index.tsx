import React from 'react'
import GoalkeeperDetails from '../../containers/goalkeeperDetails'
import PortalPage from '../../containers/portalPage'
import GoalkeeperProvider from '../../contexts/goalkeeperContext'

function Goalkeeper() {
    return (
        <PortalPage>
            <GoalkeeperProvider>
                <GoalkeeperDetails />
            </GoalkeeperProvider>
        </PortalPage>
    )
}

export default Goalkeeper