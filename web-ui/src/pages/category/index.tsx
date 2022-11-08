import React from 'react';
import PortalPage from '../../containers/portalPage'
import CategoryDetails from '../../containers/categoryDetails';
import CategoryProvider from '../../contexts/categoryContext';

function Category() {
    return (
        <PortalPage>
            <CategoryProvider>
                <CategoryDetails />
            </CategoryProvider>
        </PortalPage>
    )
}

export default Category