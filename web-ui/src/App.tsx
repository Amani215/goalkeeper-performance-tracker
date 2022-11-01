import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import AppRoutes from './router';
import AuthProvider from './contexts/authContext';
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
      <AuthProvider>
        <PageProvider>
          <AppRoutes></AppRoutes>
        </PageProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;