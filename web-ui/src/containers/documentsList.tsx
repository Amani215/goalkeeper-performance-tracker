import { useTranslation } from "react-i18next"
import { useGetDocument } from "../contexts/documentGenerationContext"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { CategoryDTO } from "../DTOs/CategoryDTO";
import { useCategory, useCategoryReady } from "../contexts/categoryContext";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Card, Divider, List, ListItem, ListItemText, Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Switch, FormGroup, FormControlLabel } from "@mui/material";

function DocumentsList() {
    const { t } = useTranslation()
    const { id } = useParams();

    const [category, setCategory] = useState<CategoryDTO | null>(null)
    const categoryContext = useCategory()
    const categoryReady = useCategoryReady()

    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (categoryContext) {
            categoryContext(id ? id : "").then(
                data => setCategory(data as CategoryDTO)
            )
        }
    }, [categoryReady, loaded])

    // GET DOCUMENT
    const documentContext = useGetDocument()
    const [loading, setLoading] = useState<boolean>(false)
    const generateDoc = async (endpoint: string) => {
        setLoading(true)
        if (documentContext) {
            await documentContext(endpoint, category ? category.id : "", force).then(res => {
                if (res != null) {
                    window.open(res, "_blank")
                    setLoading(false)
                    handleCloseDialog()
                }
            })
        }
    }

    // FORCE DOCUMENT
    const [force, setForce] = useState(false)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    const handleOpenDialog = () => {
        setDialogIsOpen(true)
    }
    const handleCloseDialog = () => {
        setDialogIsOpen(false)
        setForce(false)
    }

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Typography
                    variant='h4'
                    mb={2}>
                    Documents {`${category?.name} ${category?.season}`}
                </Typography>
            </Box>

            <Card sx={{ padding: 1 }}>
                <List>
                    <ListItem
                        secondaryAction={
                            <LoadingButton loading={loading} variant="outlined" sx={{ margin: 1 }} onClick={() => { generateDoc("goalkeepers") }}>
                                {t("download")}
                            </LoadingButton>

                        }
                    >
                        <ListItemText
                            primary={t("list_goalkeepers_per_category")}
                        />
                    </ListItem>
                    <Divider />
                    <ListItem
                        secondaryAction={
                            <LoadingButton variant="outlined" sx={{ margin: 1 }} onClick={() => { handleOpenDialog() }}>
                                {t("download")}
                            </LoadingButton>
                        }
                    >
                        <ListItemText
                            primary={t("attendance_sheet")}
                        />
                    </ListItem>
                    <Divider />
                    <ListItem
                        secondaryAction={
                            <LoadingButton loading={loading} sx={{ margin: 1 }} variant="outlined" onClick={() => { }}>
                                {t("download")}
                            </LoadingButton>

                        }
                    >
                        <ListItemText
                            primary={t("played_matches_details")}
                        />
                    </ListItem>
                    <Divider />
                    <ListItem
                        secondaryAction={
                            <LoadingButton loading={loading} sx={{ margin: 1 }} variant="outlined" onClick={() => { }}>
                                {t("download")}
                            </LoadingButton>

                        }
                    >
                        <ListItemText
                            primary={t("play_time_training_time")}
                        />
                    </ListItem>
                </List>
            </Card>

            {/* Force Generate Attendance Dialog */}
            <Dialog
                open={dialogIsOpen}
                onClose={handleCloseDialog}
            >
                <DialogTitle id="dialog-title"> {t("attendance_sheet")} </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t("file_might_be_out_of_date")}
                    </DialogContentText>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={force} />}
                            onChange={() => setForce(!force)}
                            label={t("force_regenerate")} />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>{t("cancel")}</Button>
                    <Button onClick={() => { generateDoc("attendance") }} autoFocus>{t("submit")}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DocumentsList