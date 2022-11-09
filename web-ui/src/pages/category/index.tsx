import React, { useState } from 'react';
import PortalPage from '../../containers/portalPage'
import CategoryDetails from '../../containers/categoryDetails';
import CategoryProvider from '../../contexts/categoryContext';
import NewCategoryCoach from '../../containers/modals/newCategoryCoach';
import NewCategoryGoalkeeper from '../../containers/modals/newCategoryGoalkeeper';
import UsersProvider from '../../contexts/usersContext';

function Category() {
    const [trainersModalIsOpen, setTrainersModalIsOpen] = useState<boolean>(false)
    const [goalkeepersModalIsOpen, setGoalkeepersModalIsOpen] = useState<boolean>(false)

    const handleTrainersOpen = () => setTrainersModalIsOpen(true)
    const handleTrainersClose = () => setTrainersModalIsOpen(false)

    const handleGoalkeepersOpen = () => setGoalkeepersModalIsOpen(true)
    const handleGoalkeepersClose = () => setGoalkeepersModalIsOpen(false)
    return (
        <UsersProvider>
            <NewCategoryCoach {...{ modalIsOpen: trainersModalIsOpen, setModalIsOpen: handleTrainersClose }} />
            <NewCategoryGoalkeeper {...{ modalIsOpen: goalkeepersModalIsOpen, setModalIsOpen: handleGoalkeepersClose }} />

            <PortalPage>
                <CategoryProvider>
                    <CategoryDetails
                        modal1={{
                            modalIsOpen: trainersModalIsOpen,
                            setModalIsOpen: handleTrainersOpen
                        }}
                        modal2={{
                            modalIsOpen: goalkeepersModalIsOpen,
                            setModalIsOpen: handleGoalkeepersOpen
                        }} />
                </CategoryProvider>
            </PortalPage>
        </UsersProvider>

    )
}

export default Category