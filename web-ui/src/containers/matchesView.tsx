import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMatchAdded, useMatchDeleted, useMatches, useMatchesError, useMatchesReady } from '../contexts/matchesContext'
import { MatchDTO } from '../DTOs/MatchDTO'
import MatchesList from '../components/matchesList'
import { ModalProp } from '../interfaces/modalProp'
import { useMatchUpdated } from '../contexts/matchContext'
import { useTranslation } from 'react-i18next'

function MatchesView({ setModalIsOpen }: ModalProp) {
    const { t } = useTranslation();

    const [matches, setMatches] = useState<MatchDTO[]>([])
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const matchesContext = useMatches()
    const matchesError = useMatchesError()
    const matchesReady = useMatchesReady()
    const matchAdded = useMatchAdded()
    const matchDeleted = useMatchDeleted()
    const matchUpdated = useMatchUpdated()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

    useEffect(() => {
        if (matchesContext) {
            matchesContext().then(
                data => setMatches(data as MatchDTO[])
            )
        }
        if (loaded && matchesReady && matchesError) {
            setError("No matches Found.")
        }
        if (loaded && matchesReady && !matchesError) {
            setError("")
        }
    }, [loaded, matchesReady, matchesError, matchAdded, matchDeleted, matchUpdated])

    return (
        <>
            {error != "" ?
                <Typography
                    variant='subtitle2'
                    ml={1} mt={1}>
                    {error}
                </Typography> :
                <>
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        mb={3}>
                        <Button
                            variant="contained"
                            onClick={() => { setModalIsOpen() }}
                        >{t("add_match")}
                        </Button>
                    </Box>
                    <MatchesList matches={matches} />
                </>
            }
        </>

    )
}

export default MatchesView