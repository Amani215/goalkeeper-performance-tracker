import React, { useState } from 'react'
import MatchesView from '../../containers/matchesView'
import NewMatch from '../../containers/modals/newMatch'
import PortalPage from '../../containers/portalPage'
import CategoriesProvider from '../../contexts/categoriesContext'
import MatchesProvider from '../../contexts/matchesContext'
import ParamsProvider from '../../contexts/paramsContext'

function Matches() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)

    return (
        <MatchesProvider>
            <CategoriesProvider>
                <ParamsProvider>
                    <NewMatch {...{ modalIsOpen, setModalIsOpen: handleClose }} />
                </ParamsProvider>
            </CategoriesProvider>

            <PortalPage>
                <MatchesView {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
            </PortalPage>
        </MatchesProvider>
    )
}

export default Matches