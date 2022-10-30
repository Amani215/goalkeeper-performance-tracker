import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { MdMenu } from "react-icons/md";
import AccountPopover from './AccountPopover';
import { useUser } from '../../contexts/userContext';

export default function Header() {
  const user = useUser()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MdMenu />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GPT
          </Typography>

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
