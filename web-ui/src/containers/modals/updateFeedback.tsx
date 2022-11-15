import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useMatchPerformance, useMatchPerformanceError, useMatchPerformanceReady } from '../../contexts/matchPerformanceContext';
import { MatchMonitoringDTO } from '../../DTOs/MatchMonitoringDTO';
import { ModalProp } from '../../interfaces/modalProp'


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

function UpdateFeedback({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const [error, setError] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const matchPerformanceContext = useMatchPerformance()
    const matchPerformanceError = useMatchPerformanceError()
    const matchPerformanceReady = useMatchPerformanceReady()

    useEffect(() => { setLoaded(true) }, [])

    const [matchPerformance, setmatchPerformance] = useState<MatchMonitoringDTO | null>(null)

    useEffect(() => {
        if (matchPerformanceContext) {
            setError(false)
            setmatchPerformance(matchPerformanceContext as MatchMonitoringDTO)
        }

        if (loaded && matchPerformanceReady && matchPerformanceError) {
            setError(true)
        }
    }, [loaded, matchPerformanceContext])

    const handleSubmit = async ({ localScore, visitorScore }: FormikValues): Promise<void> => {

    };

    const formik = useFormik({
        initialValues: {

        },
        onSubmit: handleSubmit
    })

    useEffect(() => {

    }, [,]);

    return (
        <></>
        // <Modal
        //     open={modalIsOpen}
        //     onClose={setModalIsOpen}
        //     aria-labelledby="modal-modal-title"
        //     aria-describedby="modal-modal-description"
        // >
        //     <Box sx={style}>
        //         <Typography id="modal-modal-title" variant="h6" component="h2">
        //             Update Scores
        //         </Typography>
        //         <Box
        //             component="form"
        //             onSubmit={formik.handleSubmit}
        //             sx={{ mt: 1 }}
        //         >
        //             <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        //                 <TextField
        //                     margin="normal"
        //                     required
        //                     fullWidth
        //                     inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        //                     id="localScore"
        //                     label={`${match?.local} Score`}
        //                     name="localScore"
        //                     autoComplete="localScore"
        //                     value={formik.values.localScore}
        //                     onChange={formik.handleChange}
        //                     autoFocus
        //                     error={formik.touched.localScore && Boolean(formik.errors.localScore)}
        //                     helperText={formik.touched.localScore && formik.errors.localScore}
        //                 />
        //                 <TextField
        //                     margin="normal"
        //                     required
        //                     fullWidth
        //                     inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        //                     id="visitorScore"
        //                     label={`${match?.visitor} Score`}
        //                     name="visitorScore"
        //                     autoComplete="visitorScore"
        //                     value={formik.values.visitorScore}
        //                     onChange={formik.handleChange}
        //                     autoFocus
        //                     error={formik.touched.visitorScore && Boolean(formik.errors.visitorScore)}
        //                     helperText={formik.touched.visitorScore && formik.errors.visitorScore}
        //                 />
        //             </Box>
        //             <Button
        //                 type="submit"
        //                 fullWidth
        //                 variant="contained"
        //                 sx={{ mt: 3, mb: 2 }}
        //             >
        //                 Update
        //             </Button>
        //         </Box>
        //     </Box>
        // </Modal>
    )
}

export default UpdateFeedback