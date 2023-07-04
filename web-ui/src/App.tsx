import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import AppRoutes from './router';
import AuthProvider from './contexts/authContext';
import PageProvider from './contexts/pageContext';

const theme = createTheme({
  palette: {
    secondary: {
      main: grey[400],
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