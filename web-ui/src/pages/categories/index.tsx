import CategoriesView from '../../containers/categoriesView'
import PortalPage from '../../containers/portalPage'
import CategoryProvider from '../../contexts/categoriesContext'

function Categories() {
    return (
        <PortalPage>
            <CategoryProvider>
                <CategoriesView />
            </CategoryProvider>
        </PortalPage>

    )
}

export default Categories