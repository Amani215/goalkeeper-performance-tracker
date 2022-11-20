import React from 'react'
import Grid from '@mui/material/Grid'
import { Card } from '@mui/material'
import { styled } from '@mui/system'

type IProps = {
    src: string,
    xs: number,
    height: number
}

const Frame = styled('iframe')({
    frameBorder: 0,
    width: "100%",
    height: "100%"
})
function GrafanaPanel({ src, xs, height }: IProps) {
    return (
        <Grid item xs={xs}>
            <Card sx={{ height: height }}>
                <Frame src={src} frameBorder="0"></Frame>
            </Card>
        </Grid>
    )
}

function GrafanaDashboard({ src, height }: IProps) {
    return (
        <Card sx={{ height: height }}>
            <Frame src={src} frameBorder="0"></Frame>
        </Card>
    )
}

export { GrafanaPanel, GrafanaDashboard }