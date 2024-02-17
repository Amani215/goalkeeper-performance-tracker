import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AccountPopover from './AccountPopover';
import { LoginDTO } from '../../DTOs/LoginDTO';
import { Switch } from '@mui/material';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

interface IProps {
  auth: LoginDTO | null
}
export default function Header({ auth }: IProps) {
  const { i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (i18n.language == "fr") {
      i18next.changeLanguage('en')
    } else {
      i18next.changeLanguage('fr')
    }
  };

  return (
    <Box sx={{ flexGrow: 1, position: "sticky", top: 0, zIndex: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>GPT</Typography> */}

          <div>
            FR
            <Switch
              checked={i18n.language == "en"}
              onChange={changeLanguage}
              color="default" />
            EN
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
