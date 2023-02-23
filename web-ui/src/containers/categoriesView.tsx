import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { IoFootballOutline } from 'react-icons/io5'
import { useAuth } from '../contexts/authContext'
import { useCategories, useCategoriesReady, useCategoryDeleted, useDeleteCategory } from '../contexts/categoriesContext'
import { CategoryDTO } from '../DTOs'
import { ModalProp } from '../interfaces/modalProp'
import { Link as RouterLink } from 'react-router-dom';
import { CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material'
import { MdClose } from 'react-icons/md'


function CategoriesView({ setModalIsOpen }: ModalProp) {
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string>("")

  const auth = useAuth()
  const categoriesContext = useCategories()
  const categoriesReady = useCategoriesReady()
  const deleteCategory = useDeleteCategory()
  const categoryDeleted = useCategoryDeleted()

  useEffect(() => {
    if (categoriesReady && categoriesContext) {
      setCategories(categoriesContext)
      setOpen(false)
      setCategoryToDelete("")
    }
  }, [categoriesReady, categoriesContext, categoryDeleted])

  const handleClickOpen = (categoryID: string) => {
    setCategoryToDelete(categoryID)
    setOpen(true);
  };

  const handleClose = () => {
    setCategoryToDelete("")
    setOpen(false);
  };

  const handleDelete = async () => {
    if (deleteCategory) {
      await deleteCategory(categoryToDelete)
    }
  }
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
              <Card raised key={c.id + "-item"} sx={{ margin: 1 }}>
                <CardHeader
                  avatar={
                    <Button
                      component={RouterLink}
                      to={`/categories/${c.id}`}>
                      <IoFootballOutline size={50} />
                    </Button>

                  }
                  action={
                    <IconButton
                      aria-label="delete"
                      sx={{ marginTop: "25%", marginLeft: 1 }}
                      onClick={() => handleClickOpen(c.id)}>
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
            ))
            :
            <Typography variant="body1">No categories yet.</Typography>}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By clicking yes you are going to delete the {categoryToDelete} category permanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default CategoriesView