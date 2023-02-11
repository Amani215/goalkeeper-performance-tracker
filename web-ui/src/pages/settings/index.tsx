import React, { useState } from 'react'
import PortalPage from '../../containers/portalPage'
import SettingsView from '../../containers/settingsView'
import ParamsProvider from '../../contexts/paramsContext'

function Settings() {
    return (
        <PortalPage>
            <ParamsProvider>
                <SettingsView />
            </ParamsProvider>
        </PortalPage>
    )
}

export default Settings