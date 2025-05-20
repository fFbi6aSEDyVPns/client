import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../redux/actions/auth';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const authLinks = (
    <Fragment>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ 
          textDecoration: 'none', 
          color: 'inherit',
          marginRight: 2
        }}>
          教育平台
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">
          儀表板
        </Button>
        <Button color="inherit" component={Link} to="/classes">
          課程
        </Button>
        <Button color="inherit" component={Link} to="/assignments">
          作業
        </Button>
        <Button color="inherit" component={Link} to="/study-logs">
          學習記錄
        </Button>
      </Box>
      <Box>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          {user?.avatar ? (
            <Avatar src={user.avatar} alt={user.name} />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={Link} to="/profile" onClick={handleClose}>
            個人資料
          </MenuItem>
          <MenuItem component={Link} to="/settings" onClick={handleClose}>
            設定
          </MenuItem>
          <MenuItem onClick={handleLogout}>登出</MenuItem>
        </Menu>
      </Box>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ 
          textDecoration: 'none', 
          color: 'inherit',
          marginRight: 2
        }}>
          教育平台
        </Typography>
      </Box>
      <Box>
        <Button color="inherit" component={Link} to="/login">
          登入
        </Button>
        <Button color="inherit" component={Link} to="/register">
          註冊
        </Button>
      </Box>
    </Fragment>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {!loading && (isAuthenticated ? authLinks : guestLinks)}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar); 