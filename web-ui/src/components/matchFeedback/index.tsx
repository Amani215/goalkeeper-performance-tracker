import React from 'react'
import { Box, Button } from '@mui/material'
import { MatchMonitoringDTO } from '../../DTOs/MatchMonitoringDTO'
import { VoidDelegate } from '../../interfaces/voidDelegate'
import { GrafanaPanel } from '../grafana'
import { useTranslation } from 'react-i18next'

type PropType = {
    matchPerformance: MatchMonitoringDTO | null,
    setModalIsOpen: VoidDelegate
}
function MatchFeedback({ matchPerformance, setModalIsOpen }: PropType) {
    const { t } = useTranslation();
    return (
        <>
            <Box
                display="flex" justifyContent="flex-end">
                <Button
                    variant='contained'
                    sx={{ marginBottom: 1, marginTop: 2 }}
                    onClick={() => { setModalIsOpen() }}>{t("update_feedback")}</Button>
            </Box>

            <GrafanaPanel src={`http://localhost/grafana/d/UbYK1obVk/match-performance?orgId=1&var-mpid=${matchPerformance?.id}&kiosk`} xs={12} height={700} />
        </>
    )
}

export default MatchFeedback