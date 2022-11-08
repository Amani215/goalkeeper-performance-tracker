import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useCategory, useCategoryError, useCategoryReady } from '../contexts/categoryContext';
import { CategoryDTO } from '../DTOs';

function CategoryDetails() {
    const { id } = useParams();

    const [category, setCategory] = useState<CategoryDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const categoryContext = useCategory()
    const categoryError = useCategoryError()
    const categoryReady = useCategoryReady()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

    useEffect(() => {
        if (categoryContext) {
            categoryContext(id ? id : "").then(
                data => setCategory(data as CategoryDTO)
            )
        }
        if (loaded && categoryReady && categoryError) {
            setError("No category Found.")
        }
        if (loaded && categoryReady && !categoryError) {
            setError("")
        }
    }, [loaded, categoryReady, categoryError, id])

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
                    {`${category?.name} ${category?.season}`}
                </Typography>

                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={4} sm={4} md={6}>
                        <Card sx={{ padding: 2 }}>
                            <Box display="flex" justifyContent="flex-end">
                                <Button>
                                    Add Coach
                                </Button>
                            </Box>
                            <p>Coaches</p>
                        </Card>
                    </Grid>

                    <Grid item xs={4} sm={4} md={6}>
                        <Card sx={{ padding: 2 }}>
                            <Box display="flex" justifyContent="flex-end">
                                <Button>
                                    Add Goalkeeper
                                </Button>
                            </Box>
                            <p>Goalkeepers</p>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

        </>

    )
}

export default CategoryDetails