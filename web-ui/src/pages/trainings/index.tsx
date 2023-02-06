import { useState } from 'react'
import { GrafanaPanel } from '../../components/grafana'
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
                <GrafanaPanel src={`http://localhost/grafana/d-solo/trainLite/trainings?from=${Math.floor(new Date('2023.03.01').getTime())}&to=${Math.floor(new Date('2023.03.31').getTime())}&orgId=1&panelId=12`} xs={12} height={600} />
            </PortalPage>
        </TrainingsProvider>
    )
}

export default Trainings