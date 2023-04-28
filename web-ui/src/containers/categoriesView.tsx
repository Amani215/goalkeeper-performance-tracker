import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { IoFootballOutline } from 'react-icons/io5'
import { useAuth } from '../contexts/authContext'
import { useArchivedCategories, useCategoriesReady, useCategoryDeleted, useDeleteCategory, useDeleteCategoryError, useNonArchivedCategories } from '../contexts/categoriesContext'
import { CategoryDTO } from '../DTOs'
import { ModalProp } from '../interfaces/modalProp'
import { Link as RouterLink } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Alert, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material'
import { MdClose, MdExpandMore } from 'react-icons/md'
import { useTranslation } from 'react-i18next'


function CategoriesView({ setModalIsOpen }: ModalProp) {
  const { t } = useTranslation()
  const [nonArchivedCategories, setNonArchivedCategories] = useState<CategoryDTO[]>([])
  const [archivedCategories, setArchivedCategories] = useState<CategoryDTO[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string>("")
  // const [deleteCategoryErrorMessage, setDeleteCategoryError] = useState<string>("")

  const auth = useAuth()
  const nonArchivedCategoriesContext = useNonArchivedCategories()
  const archivedCategoriesContext = useArchivedCategories()
  const categoriesReady = useCategoriesReady()

  const deleteCategory = useDeleteCategory()
  const categoryDeleted = useCategoryDeleted()
  const deleteCategoryError = useDeleteCategoryError()

  useEffect(() => {
    if (categoriesReady && nonArchivedCategoriesContext) {
      setNonArchivedCategories(nonArchivedCategoriesContext)
      setOpen(false)
      setCategoryToDelete("")
    }
    if (categoriesReady && archivedCategoriesContext) {
      setArchivedCategories(archivedCategoriesContext)
      setOpen(false)
      setCategoryToDelete("")
    }
  }, [categoriesReady, archivedCategoriesContext, nonArchivedCategoriesContext, categoryDeleted])

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
          >{t("add_category")}
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
          nonArchivedCategories.length > 0 ?
            nonArchivedCategories.map((c) => (
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
                    auth?.user.admin ?
                      <IconButton
                        aria-label="delete"
                        sx={{ marginTop: "25%", marginLeft: 1 }}
                        onClick={() => handleClickOpen(c.id)}>
                        <MdClose />
                      </IconButton> : <></>
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
            <Typography variant="body1">{t("no_categories")}</Typography>}
      </Grid>

      <Accordion sx={{ marginTop: 5 }}>
        <AccordionSummary
          expandIcon={<MdExpandMore />}
        >
          <Typography fontWeight="bold" style={{ color: '#757575' }}>{t("archived_categories")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            columns={{ xs: 4, sm: 8, md: 12 }}>
            {
              archivedCategories.length > 0 ?
                archivedCategories.map((c) => (
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
                        auth?.user.admin ?
                          <IconButton
                            aria-label="delete"
                            sx={{ marginTop: "25%", marginLeft: 1 }}
                            onClick={() => handleClickOpen(c.id)}>
                            <MdClose />
                          </IconButton> : <></>
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
                <Typography variant="body1">{t("no_categories")}</Typography>}
          </Grid>
        </AccordionDetails>
      </Accordion>



      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("are_you_sure")}
        </DialogTitle>
        <DialogContent>
          {deleteCategoryError != "" ?
            <Alert severity='error' sx={{ marginBottom: 1 }}>{deleteCategoryError}</Alert>
            : <></>}
          <DialogContentText id="alert-dialog-description">
            {t("deleting_category_warning")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button onClick={handleDelete} autoFocus>
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default CategoriesView