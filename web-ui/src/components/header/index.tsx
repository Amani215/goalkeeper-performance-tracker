import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountPopover from './AccountPopover';
import { useUser } from '../../contexts/userContext';

export default function Header() {
  const user = useUser()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>GPT</Typography>

          <div>
            <AccountPopover username={user ? user.username : ""}
              profile_pic={user ? user.profile_pic : ""}
              status={(user && user.admin) ? "Admin" : "Coach"} />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
