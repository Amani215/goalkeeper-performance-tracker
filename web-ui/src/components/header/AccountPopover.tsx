import { useState } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
  Icon,
} from "@mui/material";
import { MdLogout, MdPerson } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

interface IProps {
  id: string,
  username: string,
  profile_pic: string,
  status: string
}

export default function AccountPopover(props: Readonly<IProps>) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 1,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {props.profile_pic != "" ?
          <Avatar src={props.profile_pic} alt="photoURL" /> :
          <Avatar sx={{ bgcolor: 'secondary.main' }}></Avatar>
        }
      </IconButton>

      <Popover
        open={Boolean(open)}
        // anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              p: 0,
              mt: 5,
              ml: 0.75,
              width: 180,
              "& .MuiMenuItem-root": {
                typography: "body2",
                borderRadius: 0.75,
              },
            }
          }
        }}
      >


        <Box sx={{ my: 1.5, px: 2.5 }}
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
        >
          <Avatar src={props.profile_pic} alt="photoURL" sx={{ width: 56, height: 56 }} />
          <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" align="center" noWrap>
            {props.username}
          </Typography>

          <Typography variant="subtitle2" align="center" noWrap>
            {props.status}
          </Typography>
        </Box>

        <MenuItem sx={{ m: 1 }}>
          <Link component={RouterLink} to={`/users/${props.id}`} underline="none" color="inherit">
            <Icon sx={{ mr: 1 }}>
              <MdPerson />
            </Icon>
            Profile
          </Link>
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem sx={{ m: 1 }}>
          <Link component={RouterLink} to="/logout" underline="none" color="inherit">
            <Icon sx={{ mr: 1 }}>
              <MdLogout />
            </Icon>
            Logout
          </Link>
        </MenuItem>

      </Popover>
    </>
  );
}
