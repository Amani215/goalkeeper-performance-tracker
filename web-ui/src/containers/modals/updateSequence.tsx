import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from '../../contexts/paramsContext';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useUpdateMatch } from '../../contexts/matchContext';
import { MatchSequenceDTO } from '../../DTOs/MatchSequenceDTO';
import { useUpdateMatchSequence } from '../../contexts/matchPerformanceContext';
import { useTranslation } from 'react-i18next'

type PropType = {
    sequence: MatchSequenceDTO | null,
    modalProp: ModalProp
}
function UpdateSequence({ sequence, modalProp }: PropType) {
    const { t } = useTranslation();
    const updateSequence = useUpdateMatchSequence()

    useEffect(() => {
        if (sequence) {
            setNumber(sequence.sequence_number);
            setAction(sequence.action_type);
            setReaction(sequence.reaction_type);
            setResult(sequence.action_result);
            setComment(sequence.comment);
        }
    }, [sequence])

    // Sequence object attributes
    const [sequenceNumber, setNumber] = useState<number>(0);
    const [action, setAction] = useState<string>('');
    const [reaction, setReaction] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [comment, setComment] = useState<string>('');

    // Action, Reaction, and Results lists
    const [actions, setActions] = useState<string[]>([])
    const [reactions, setReactions] = useState<string[]>([])
    const [results, setResults] = useState<string[]>([])
    const paramsContext = useParams()
    useEffect(() => {
        if (paramsContext) {
            paramsContext("action_types").then(res => setActions(res as string[]))
            paramsContext("reaction_types").then(res => setReactions(res as string[]))
            paramsContext("action_result").then(res => setResults(res as string[]))
        }
    }, [paramsContext])

    // Update
    const handleSubmit = async ({ sequenceNumber, action, reaction, result, comment }: FormikValues) => {
        if (updateSequence) {
            await updateSequence(
                {
                    'id': sequence ? sequence.id : '',
                    'sequence_number': sequenceNumber,
                    'action_type': action,
                    'reaction_type': reaction,
                    'action_result': result,
                    'comment': comment
                })
            modalProp.setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            sequenceNumber: sequenceNumber,
            action: action,
            reaction: reaction,
            result: result,
            comment: comment,
        },
        onSubmit: handleSubmit
    })

    useEffect(() => {
        formik.setValues({ ...{ sequenceNumber, action, reaction, result, comment } });
    }, [sequenceNumber, action, reaction, result, comment]);

    return (
        <Modal
            open={modalProp.modalIsOpen}
            onClose={modalProp.setModalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("update_sequence")} {sequenceNumber}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        size="small"
                        required
                        fullWidth
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        id="sequenceNumber"
                        label={t("sequence_number")}
                        name="sequenceNumber"
                        autoComplete="sequenceNumber"
                        value={formik.values.sequenceNumber}
                        onChange={formik.handleChange}
                        autoFocus
                    />

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">Action</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.action}
                            label="Action"
                            onChange={(e) => formik.setFieldValue("action", e.target.value)}
                        >
                            {actions.map((action) => (
                                <MenuItem key={action} value={action}>{action}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">Reaction</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.reaction}
                            label="Reaction"
                            onChange={(e) => formik.setFieldValue("reaction", e.target.value)}
                        >
                            {reactions.map((reaction) => (
                                <MenuItem key={reaction} value={reaction}>{reaction}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">{t("result")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.result}
                            label={t("result")}
                            onChange={(e) => formik.setFieldValue("result", e.target.value)}
                        >
                            {results.map((result) => (
                                <MenuItem key={result} value={result}>{result}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        margin="normal"
                        size="small"
                        fullWidth
                        id="comment"
                        label={t("comment")}
                        name="comment"
                        autoComplete="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        autoFocus
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {t("update")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default UpdateSequence