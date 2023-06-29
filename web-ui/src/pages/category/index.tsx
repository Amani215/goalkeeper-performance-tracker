import React, { useState } from 'react';
import PortalPage from '../../containers/portalPage'
import CategoryDetails from '../../containers/categoryDetails';
import CategoryProvider from '../../contexts/categoryContext';
import NewCategoryCoach from '../../containers/modals/newCategoryCoach';
import NewCategoryGoalkeeper from '../../containers/modals/newCategoryGoalkeeper';
import UsersProvider from '../../contexts/usersContext';
import GoalkeepersProvider from '../../contexts/goalkeepersContext';
import DocumentGenerationProvider from '../../contexts/documentGenerationContext';
import PlanningProvider from '../../contexts/planningContext';
import ParamsProvider from '../../contexts/paramsContext';

function Category() {
    const [trainersModalIsOpen, setTrainersModalIsOpen] = useState<boolean>(false)
    const [goalkeepersModalIsOpen, setGoalkeepersModalIsOpen] = useState<boolean>(false)

    const handleTrainersOpen = () => setTrainersModalIsOpen(true)
    const handleTrainersClose = () => setTrainersModalIsOpen(false)

    const handleGoalkeepersOpen = () => setGoalkeepersModalIsOpen(true)
    const handleGoalkeepersClose = () => setGoalkeepersModalIsOpen(false)
    return (
        <CategoryProvider>
            <UsersProvider>
                <GoalkeepersProvider>
                    <NewCategoryCoach {...{ modalIsOpen: trainersModalIsOpen, setModalIsOpen: handleTrainersClose }} />
                    <NewCategoryGoalkeeper {...{ modalIsOpen: goalkeepersModalIsOpen, setModalIsOpen: handleGoalkeepersClose }} />

                    <PortalPage>
                        <PlanningProvider>
                            <DocumentGenerationProvider>
                                <ParamsProvider>
                                    <CategoryDetails
                                        modal1={{
                                            modalIsOpen: trainersModalIsOpen,
                                            setModalIsOpen: handleTrainersOpen
                                        }}
                                        modal2={{
                                            modalIsOpen: goalkeepersModalIsOpen,
                                            setModalIsOpen: handleGoalkeepersOpen
                                        }} />
                                </ParamsProvider>
                            </DocumentGenerationProvider>
                        </PlanningProvider>
                    </PortalPage>
                </GoalkeepersProvider>
            </UsersProvider>
        </CategoryProvider>
    )
}

export default Category