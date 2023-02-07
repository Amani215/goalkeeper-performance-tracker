import { useState } from 'react'
import NewTraining from '../../containers/modals/newTraining'
import PortalPage from '../../containers/portalPage'
import TrainingsView from '../../containers/trainingsView'
import CategoriesProvider from '../../contexts/categoriesContext'
import TrainingsProvider from '../../contexts/trainingsContext'

function Trainings() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)

    return (
        <TrainingsProvider>
            <CategoriesProvider>
                <NewTraining {...{ modalIsOpen, setModalIsOpen: handleClose }} />
            </CategoriesProvider>

            <PortalPage>
                <TrainingsView {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
            </PortalPage>
        </TrainingsProvider>
    )
}

export default Trainings