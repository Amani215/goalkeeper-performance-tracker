import React from 'react'
import PortalPage from '../../containers/portalPage'
import DocumentGenerationProvider from '../../contexts/documentGenerationContext'
import DocumentsList from '../../containers/documentsList'
import CategoryProvider from '../../contexts/categoryContext'

function Documents() {
    return (
        <PortalPage>
            <CategoryProvider>
                <DocumentGenerationProvider>
                    <DocumentsList />
                </DocumentGenerationProvider>
            </CategoryProvider>
        </PortalPage>
    )
}

export default Documents