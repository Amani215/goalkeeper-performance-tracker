import { useState } from 'react'
import CategoriesView from '../../containers/categoriesView'
import PortalPage from '../../containers/portalPage'
import CategoryProvider from '../../contexts/categoriesContext'

function Categories() {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)

    return (
        <PortalPage>
            <CategoryProvider>
                <CategoriesView {...{ modalIsOpen, setModalIsOpen: handleOpen }} />
            </CategoryProvider>
        </PortalPage>

    )
}

export default Categories