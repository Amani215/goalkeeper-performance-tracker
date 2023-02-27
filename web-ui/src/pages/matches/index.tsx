import React, { useState } from 'react'
import MatchesView from '../../containers/matchesView'
import NewMatch from '../../containers/modals/newMatch'
import PortalPage from '../../containers/portalPage'
import CategoriesProvider from '../../contexts/categoriesContext'
import MatchesProvider from '../../contexts/matchesContext'
import ParamsProvider from '../../contexts/paramsContext'
import MatchProvider from '../../contexts/matchContext'

function Matches() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)

    return (
        <MatchesProvider>
            <ParamsProvider>
                <CategoriesProvider>
                    <NewMatch {...{ modalIsOpen, setModalIsOpen: handleClose }} />

                    <PortalPage>
                        <MatchProvider>
                            <MatchesView {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
                        </MatchProvider>
                    </PortalPage>
                </CategoriesProvider>
            </ParamsProvider>
        </MatchesProvider>
    )
}

export default Matches