import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import AppRoutes from './router';
import UserProvider from './contexts/authContext';
import PageProvider from './contexts/pageContext';

const theme = createTheme({
  palette: {
    secondary: {
      main: green[700],
    },
  },
});

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <PageProvider>
          <AppRoutes></AppRoutes>
        </PageProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App;