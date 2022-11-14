import React, { useState } from 'react'
import MatchDetails from '../../containers/matchDetails'
import NewMatchGoalkeeper from '../../containers/modals/newMatchGoalkeeper'
import UpdateScore from '../../containers/modals/updateScore'
import PortalPage from '../../containers/portalPage'
import GoalkeepersProvider from '../../contexts/goalkeepersContext'
import MatchProvider from '../../contexts/matchContext'

function Match() {
    const [scoresModalIsOpen, setScoresModalIsOpen] = useState<boolean>(false)
    const [goalkeepersModalIsOpen, setGoalkeepersModalIsOpen] = useState<boolean>(false)

    const handleScoresOpen = () => setScoresModalIsOpen(true)
    const handleScoresClose = () => setScoresModalIsOpen(false)

    const handleGoalkeepersOpen = () => setGoalkeepersModalIsOpen(true)
    const handleGoalkeepersClose = () => setGoalkeepersModalIsOpen(false)
    return (
        <PortalPage>
            <MatchProvider>
                <UpdateScore {...{ modalIsOpen: scoresModalIsOpen, setModalIsOpen: handleScoresClose }} />

                <GoalkeepersProvider>
                    <NewMatchGoalkeeper {...{ modalIsOpen: goalkeepersModalIsOpen, setModalIsOpen: handleGoalkeepersClose }} />
                </GoalkeepersProvider>

                <MatchDetails
                    modal1={{
                        modalIsOpen: scoresModalIsOpen,
                        setModalIsOpen: handleScoresOpen
                    }}
                    modal2={{
                        modalIsOpen: goalkeepersModalIsOpen,
                        setModalIsOpen: handleGoalkeepersOpen
                    }} />
            </MatchProvider>
        </PortalPage>
    )
}

export default Match