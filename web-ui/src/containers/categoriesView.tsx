import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { MdSportsSoccer } from 'react-icons/md'
import { useCategories, useCategoriesReady } from '../contexts/categoriesContext'
import { CategoryDTO } from '../DTOs'

function CategoriesView() {
  const [categories, setCategories] = useState<CategoryDTO[]>([])

  const categoriesContext = useCategories()
  const categoriesReady = useCategoriesReady()

  useEffect(() => {
    console.log("categories", categoriesContext)
    if (categoriesReady && categoriesContext) {
      setCategories(categoriesContext)
    }
  }, [categoriesReady, categoriesContext])

  return (
    <Grid container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      columns={{ xs: 4, sm: 8, md: 12 }}>
      {categories.map((c) => (
        <Button key={c.id + "-item"}>
          <Card raised>
            <Grid item xs={2} sm={2} md={3}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                  minWidth: { xs: 180, sm: 180, md: 180 },
                }}
                mt={1}>
                <MdSportsSoccer size={70} />
                <Typography variant="body1" >
                  {c.name}
                </Typography>
                <Typography variant="body2" mb={1}>
                  {c.season}
                </Typography>
              </Box>
            </Grid>
          </Card>
        </Button>
      ))}
    </Grid>
  )
}

export default CategoriesView