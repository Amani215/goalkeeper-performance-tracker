import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import AppRoutes from './router';
import UserProvider from './contexts/userContext';

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
      <AppRoutes></AppRoutes>
    </UserProvider>
  </ThemeProvider>
  )
}

export default App;