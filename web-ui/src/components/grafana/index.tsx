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
    border: 0,
    width: "100%",
    height: "100%"
})
function GrafanaPanel({ src, xs, height }: Readonly<IProps>) {
    return (
        <Grid item xs={xs}>
            <Card sx={{ height: height }}>
                <Frame src={src}></Frame>
            </Card>
        </Grid>
    )
}

function GrafanaDashboard({ src, height }: Readonly<IProps>) {
    return (
        <Card sx={{ height: height }}>
            <Frame src={src}></Frame>
        </Card>
    )
}

export { GrafanaPanel, GrafanaDashboard }