import { useState } from 'react'
import CategoriesView from '../../containers/categoriesView'
import PortalPage from '../../containers/portalPage'
import CategoriesProvider from '../../contexts/categoriesContext'
import NewCategory from '../../containers/modals/newCategory'

function Categories() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)

    return (
        <CategoriesProvider>
            <NewCategory {...{ modalIsOpen, setModalIsOpen: handleClose }} />


            <PortalPage>
                <CategoriesView {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
            </PortalPage>
        </CategoriesProvider>
    )
}

export default Categories