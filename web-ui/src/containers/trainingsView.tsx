import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React from 'react'
import { ModalProp } from '../interfaces/modalProp'

function TrainingsView({ setModalIsOpen }: ModalProp) {
    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={3}>
                <Button
                    variant="contained"
                    onClick={() => { setModalIsOpen() }}
                >Add Training
                </Button>
            </Box>
        </>
    )
}

export default TrainingsView