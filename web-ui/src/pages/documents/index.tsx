import React from 'react'
import PortalPage from '../../containers/portalPage'
import DocumentGenerationProvider from '../../contexts/documentGenerationContext'
import DocumentsList from '../../containers/documentsList'

function Documents() {
    return (
        <PortalPage>
            <DocumentGenerationProvider>
                <DocumentsList />
            </DocumentGenerationProvider>
        </PortalPage>
    )
}

export default Documents