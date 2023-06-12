import { useTranslation } from "react-i18next"
import { useGetDocument } from "../contexts/documentGenerationContext"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { CategoryDTO } from "../DTOs/CategoryDTO";
import { useCategory, useCategoryReady } from "../contexts/categoryContext";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Card, Divider, List, ListItem, ListItemText, Box, Typography } from "@mui/material";

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
    const generateDoc = async () => {
        setLoading(true)
        if (documentContext) {
            await documentContext("goalkeepers", category ? category.id : "").then(res => {
                if (res != null) {
                    window.open(res, "_blank")
                    setLoading(false)
                }
            })
        }
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
                            <LoadingButton loading={loading} variant="outlined" sx={{ margin: 1 }} onClick={() => { generateDoc() }}>
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
                            <LoadingButton variant="outlined" sx={{ margin: 1 }} onClick={() => { }}>
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
        </>
    )
}

export default DocumentsList