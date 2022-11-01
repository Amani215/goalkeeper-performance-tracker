import { styled, Theme, CSSObject, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { MdChevronLeft, MdMenu } from 'react-icons/md';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { useSideNavIsOpen, useToggleSideNav } from '../../contexts/pageContext';
import menuItems from "./items"
import { Fragment } from 'react';


const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(0, 1),
    backgroundColor: theme.palette.primary.main,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function MiniDrawer() {
    const sideNavIsOpen = useSideNavIsOpen();
    const toggleSideNav = useToggleSideNav();
    const theme = useTheme()
    return (

        <Drawer variant="permanent" open={sideNavIsOpen}>
            <DrawerHeader>
                <IconButton onClick={toggleSideNav ? toggleSideNav : () => { }}>
                    {sideNavIsOpen ? <MdChevronLeft color={theme.palette.primary.contrastText} /> : <MdMenu color={theme.palette.primary.contrastText} />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            {menuItems.map(menu => (
                <Fragment key={`MENU_${menu[0].name}`}>
                    <List>
                        {menu.map((item, index) => (
                            <Link key={item.name + "collapsed"}  component={RouterLink} to={item.link} underline="none" color="inherit">
                                <ListItem disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: sideNavIsOpen ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: sideNavIsOpen ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <item.MenuIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} sx={{ opacity: sideNavIsOpen ? 1 : 0 }} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>

                        ))}
                    </List>
                    <Divider />
                </Fragment>
            ))
            }
        </Drawer>
    );
}

