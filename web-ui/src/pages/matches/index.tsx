import React, { useState } from 'react'
import MatchesView from '../../containers/matchesView'
import NewMatch from '../../containers/modals/newMatch'
import PortalPage from '../../containers/portalPage'
import MatchesProvider from '../../contexts/matchesContext'

function Matches() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)

    return (
        <MatchesProvider>
            <NewMatch {...{ modalIsOpen, setModalIsOpen: handleClose }} />
            <PortalPage>
                <MatchesView {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
            </PortalPage>
        </MatchesProvider>
    )
}

export default Matches