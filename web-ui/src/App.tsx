import Login from './pages/landing/login';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

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
    <Login />
  </ThemeProvider>
  )
}

export default App;