import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { IoFootballOutline } from 'react-icons/io5'
import { useAuth } from '../contexts/authContext'
import { useCategories, useCategoriesReady } from '../contexts/categoriesContext'
import { CategoryDTO } from '../DTOs'
import { ModalProp } from '../interfaces/modalProp'
import { Link as RouterLink } from 'react-router-dom';
import { CardHeader, IconButton } from '@mui/material'
import { MdClose } from 'react-icons/md'


function CategoriesView({ setModalIsOpen }: ModalProp) {
  const [categories, setCategories] = useState<CategoryDTO[]>([])

  const auth = useAuth()
  const categoriesContext = useCategories()
  const categoriesReady = useCategoriesReady()

  useEffect(() => {
    if (categoriesReady && categoriesContext) {
      setCategories(categoriesContext)
    }
  }, [categoriesReady, categoriesContext])

  return (
    <>
      {auth?.user.admin ?
        <Box
          display="flex"
          justifyContent="flex-end"
          mb={3}>
          <Button
            variant="contained"
            onClick={() => { setModalIsOpen() }}
          >Add Category
          </Button>
        </Box> : <></>
      }

      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        columns={{ xs: 4, sm: 8, md: 12 }}>
        {
          categories.length > 0 ?
            categories.map((c) => (
              <Button
                key={c.id + "-item"}
                component={RouterLink}
                to={`/categories/${c.id}`}>
                <Card raised>
                  <CardHeader
                    avatar={
                      <IoFootballOutline size={50} />
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MdClose />
                      </IconButton>
                    }
                    title={c.name}
                    subheader={c.season}
                  />
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
                    </Box>
                  </Grid>
                </Card>
              </Button>
            ))
            :
            <Typography variant="body1">No categories yet.</Typography>}
      </Grid>
    </>

  )
}

export default CategoriesView