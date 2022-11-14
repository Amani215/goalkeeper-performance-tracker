import React, { useState } from 'react'
import MatchDetails from '../../containers/matchDetails'
import UpdateScore from '../../containers/modals/updateScore'
import PortalPage from '../../containers/portalPage'
import MatchProvider from '../../contexts/matchContext'

function Match() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)
    return (
        <PortalPage>
            <MatchProvider>
                <UpdateScore {...{ modalIsOpen, setModalIsOpen: handleClose }} />
                <MatchDetails {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
            </MatchProvider>
        </PortalPage>
    )
}

export default Match