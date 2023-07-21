import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Typography } from '@mui/material'
import { MdExpandMore } from 'react-icons/md'
import { useAuth } from '../contexts/authContext'
import SettingsList from './settingsList'
import { useTranslation } from 'react-i18next';

function SettingsView() {
    const { t } = useTranslation();
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
                    {/* GENERAL SETTINGS */}
                    <Box sx={{ marginTop: 2, marginBottom: 1 }}>
                        <Typography variant='h6'>{t("general")}</Typography>
                    </Box>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("teams")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="teams" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("category_names")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="category_names" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("seasons")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="seasons" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("calendar_types")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="calendar_types" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("attendance")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="attendance" />
                        </AccordionDetails>
                    </Accordion>

                    {/* MATCH SETTINGS */}
                    <Box sx={{ marginTop: 2, marginBottom: 1 }}>
                        <Typography variant='h6'>{t("matches")}</Typography>
                    </Box>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("match_types")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="match_types" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("locations")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="locations" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("action_types")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="action_types" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("reaction_types")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="reaction_types" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("action_result")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="action_result" />
                        </AccordionDetails>
                    </Accordion>


                    {/* PLANNING SETTINGS */}
                    <Box sx={{ marginTop: 2, marginBottom: 1 }}>
                        <Typography variant='h6'>{t("planning")}</Typography>
                    </Box>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("planning_types")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="planning_types" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("techniques")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="techniques" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("physiques")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="physiques" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("psychomotricity")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="psychomotricity" />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                        >
                            <Typography>{t("tactics")}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SettingsList itemsName="tactics" />
                        </AccordionDetails>
                    </Accordion>
                </Box> :
                <Typography>{t("user_not_allowed")}</Typography>
            }

        </Box>
    )
}

export default SettingsView