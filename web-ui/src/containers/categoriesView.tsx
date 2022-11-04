import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { MdSportsSoccer } from 'react-icons/md'

interface CategoryType {
  name: string
}
function CategoriesView() {
  const categories: CategoryType[] = [{ name: "categ1" }, { name: "categ2" }, { name: "categ1" }, { name: "categ2" }, { name: "categ1" }, { name: "categ2" }]

  return (
    <Grid container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      columns={{ xs: 4, sm: 8, md: 12 }}>
      {categories.map((c: CategoryType) => (
        <Button>
          <Card raised>
            <Grid item xs={2} sm={2} md={3}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                  minWidth: { xs: 180, sm: 180, md: 180 },
                }}>
                <MdSportsSoccer size={70} />
                {c.name}
              </Box>
            </Grid>
          </Card></Button>
      ))}
    </Grid>
  )
}

export default CategoriesView