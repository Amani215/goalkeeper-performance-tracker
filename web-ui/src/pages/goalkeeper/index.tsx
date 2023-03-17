import React from 'react'
import GoalkeeperDetails from '../../containers/goalkeeperDetails'
import PortalPage from '../../containers/portalPage'
import GoalkeeperProvider from '../../contexts/goalkeeperContext'
import GrowthProvider from '../../contexts/growthContext'

function Goalkeeper() {
    return (
        <PortalPage>
            <GoalkeeperProvider>
                <GrowthProvider>
                    <GoalkeeperDetails />
                </GrowthProvider>
            </GoalkeeperProvider>
        </PortalPage>
    )
}

export default Goalkeeper