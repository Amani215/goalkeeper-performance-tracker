import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { MdExpandMore } from 'react-icons/md'
import { useAuth } from '../contexts/authContext'
import SettingsList from './settingsList'

function SettingsView() {
    const auth = useAuth()

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            {auth?.user.admin ?
                <Box
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        width: { xs: "100%", md: "70%" }
                    }}
                >
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Teams</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="teams" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Category Names</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="category_names" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Match Types</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="match_types" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Locations</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="locations" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Action Types</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="action_types" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Reaction Types</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="reaction_types" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Action Result</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="action_result" />
                        </AccordionDetails>
                    </Accordion>
                </Box> :
                <Typography>User not allowed.</Typography>
            }

        </Box>
    )
}

export default SettingsView