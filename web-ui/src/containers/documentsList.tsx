import { useTranslation } from "react-i18next"
import { useGetDocument } from "../contexts/documentGenerationContext"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { CategoryDTO } from "../DTOs/CategoryDTO";
import { useCategory } from "../contexts/categoryContext";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button } from "@mui/material";

function DocumentsList() {
    const { t } = useTranslation()
    const { id } = useParams();

    const [category, setCategory] = useState<CategoryDTO | null>(null)
    const categoryContext = useCategory()

    useEffect(() => {
        if (categoryContext) {
            categoryContext(id ? id : "").then(
                data => setCategory(data as CategoryDTO)
            )
        }
    }, [])

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
            <LoadingButton loading={loading} variant="contained" onClick={() => { generateDoc() }}>
                {t("list_goalkeepers_per_category")}
            </LoadingButton>
            <Button variant="contained" sx={{ marginTop: 1 }} onClick={() => { }}>
                {t("attendance_sheet")}
            </Button>
        </>
    )
}

export default DocumentsList