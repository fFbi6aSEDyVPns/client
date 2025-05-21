import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { logout } from '../../redux/actions/auth';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const authLinks = (
    <>
      <Button color="inherit" component={RouterLink} to="/dashboard">
      Dashboard
      </Button>
      <Button color="inherit" component={RouterLink} to="/assignments">
        Homework
      </Button>
      <Button color="inherit" component={RouterLink} to="/schedule">
      Timetable
      </Button>
      <Button color="inherit" component={RouterLink} to="/study-logs">
      Study Log
      </Button>
      <Box ml={2}>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          {user && (
            <MenuItem disabled>
              {user.name} ({user.role})
            </MenuItem>
          )}
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>logout</MenuItem>
        </Menu>
      </Box>
    </>
  );

  const guestLinks = (
    <>
      <Button color="inherit" component={RouterLink} to="/login">
        login
      </Button>
      <Button color="inherit" component={RouterLink} to="/register">
        Register
      </Button>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Button color="inherit" component={RouterLink} to="/">
          Learning Platform
          </Button>
        </Typography>
        {isAuthenticated ? authLinks : guestLinks}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;