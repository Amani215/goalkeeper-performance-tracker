import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMatches, useMatchesError, useMatchesReady } from '../contexts/matchesContext'
import { MatchDTO } from '../DTOs/MatchDTO'

function MatchesView() {
    const [pastMatches, setPastMatches] = useState<MatchDTO[]>([])
    const [upcomingMatches, setUpcomingMatches] = useState<MatchDTO[]>([])
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const matchesContext = useMatches()
    const matchesError = useMatchesError()
    const matchesReady = useMatchesReady()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

    useEffect(() => {
        if (matchesContext) {
            matchesContext(true).then(
                data => setPastMatches(data as MatchDTO[])
            )
            matchesContext(false).then(
                data => setUpcomingMatches(data as MatchDTO[])
            )
        }
        if (loaded && matchesReady && matchesError) {
            setError("No matches Found.")
        }
        if (loaded && matchesReady && !matchesError) {
            setError("")
        }
    }, [loaded, matchesReady, matchesError])

    return (
        <>
            {error != "" ?
                <Typography
                    variant='subtitle2'
                    ml={1} mt={1}>
                    {error}
                </Typography> : <></>}
        </>

    )
}

export default MatchesView