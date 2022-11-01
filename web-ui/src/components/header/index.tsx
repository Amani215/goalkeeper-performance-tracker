import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountPopover from './AccountPopover';
import { useAuth } from '../../contexts/userContext';

export default function Header() {
  const auth = useAuth()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>GPT</Typography>

          <div>
            <AccountPopover
              id={auth?.user ? auth.user.id : ""}
              username={auth?.user ? auth.user.username : ""}
              profile_pic={auth?.user ? auth.user.profile_pic : ""}
              status={(auth?.user && auth.user.admin) ? "Admin" : "Coach"} />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
