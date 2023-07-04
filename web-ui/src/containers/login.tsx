import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useLogin, useLoginError } from '../contexts/loginContext';
import { useAuth } from '../contexts/authContext';
import { Navigate, useLocation } from 'react-router-dom';
import { FormikValues, useFormik } from 'formik';
import loginValidationSchema from "../schemas/loginValidation"
import Alert from '@mui/material/Alert';

function Copyright(props: any): JSX.Element {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/Amani215/goalkeeper-performance-tracker" sx={{ marginRight: 1 }}>
        FB Keeper Coach
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function SignInSide(): JSX.Element {
  const [loaded, setLoaded] = useState(false)
  let [loginError, setLoginError] = useState(false)

  useEffect(
    () => setLoaded(true), []
  )

  const auth = useAuth()
  const location = useLocation()
  const loginErrorContext = useLoginError()

  const login = useLogin()
  const handleSubmit = async ({ username, password }: FormikValues): Promise<void> => {
    if (login) {
      await login(username, password)
      if (loginErrorContext) setLoginError(true)
    }
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: loginValidationSchema,
    onSubmit: handleSubmit
  })
  if (loaded && auth?.user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          // Photo by Omar Ramadan: https://www.pexels.com/photo/team-playing-football-on-sports-field-6507967/
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/loginBg.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => t.palette.mode === 'light'
            ? t.palette.grey[50]
            : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {loginError ?
            <Alert severity="error" onClose={() => { setLoginError(false) }}>
              Incorrect username or password.
            </Alert> :
            <></>
          }

          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1 }}
          >

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              onChange={formik.handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid >
  );
}
