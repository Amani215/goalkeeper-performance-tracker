import SignInSide from '../../containers/login';
import LoginProvider from '../../contexts/loginContext'

export default function Login() {
  return (
    <LoginProvider>
      <SignInSide />
    </LoginProvider>
  )
}
