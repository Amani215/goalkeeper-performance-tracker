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
import { MdLogout } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

interface IProps {
  username: string,
  profile_pic: string,
  status: string
}

export default function AccountPopover(props: IProps) {
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
          p: 0,
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
        <Avatar src={props.profile_pic} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        // anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
        >
          <Avatar src={props.profile_pic} alt="photoURL" sx={{ width: 64, height: 64 }} />
          <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" align="center" noWrap>
            {props.username}
          </Typography>
          <Typography variant="subtitle2" align="center" noWrap>
            {props.status}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

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
