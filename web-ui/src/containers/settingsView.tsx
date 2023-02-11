import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MdExpandMore } from 'react-icons/md'
import { useAuth } from '../contexts/authContext'
import { useParams } from '../contexts/paramsContext'
import SettingsList from '../components/settingsList'

function SettingsView() {
    const auth = useAuth()
    const [teams, setTeams] = useState<string[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [matchTypes, setMatchTypes] = useState<string[]>([])
    const [locations, setLocations] = useState<string[]>([])

    const paramsContext = useParams()

    useEffect(() => {
        if (paramsContext) {
            paramsContext("teams").then(res => setTeams(res as string[]))
            paramsContext("match_types").then(res => setMatchTypes(res as string[]))
            paramsContext("category_names").then(res => setCategories(res as string[]))
            paramsContext("locations").then(res => setLocations(res as string[]))
        }
    }, [paramsContext])

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
                            <SettingsList items={teams} />
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
                            <SettingsList items={categories} />
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
                            <SettingsList items={matchTypes} />
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
                            <SettingsList items={locations} />
                        </AccordionDetails>
                    </Accordion>
                </Box> :
                <Typography>User not allowed.</Typography>
            }

        </Box>
    )
}

export default SettingsView