import React, { useState } from 'react';
import {
  Box, Typography, Button, Avatar, Menu, MenuItem,
  ListItemIcon, ListItemText, Divider, Tooltip,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth, selectIsAuthenticated } from '../../store/slices/authSlice';

export default function Navbar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector(selectAuth);
  const isAuth    = useSelector(selectIsAuthenticated);
  const [anchor, setAnchor] = useState(null);

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    setAnchor(null);
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky', top: 0, zIndex: 50,
        px: { xs: 3, md: 5 }, py: 1.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        bgcolor: 'rgba(248,247,244,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      <Link to={isAuth ? '/' : '/login'} style={{ textDecoration: 'none' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '9px',
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            }}
          >
            <CalendarMonthIcon sx={{ color: '#fff', fontSize: 17 }} />
          </Box>
          <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.2rem', color: '#111', fontWeight: 400 }}>
            Scheduly
          </Typography>
        </Box>
      </Link>

      {isAuth && user ? (
        <>
          <Tooltip title="Account">
            <Button
              onClick={(e) => setAnchor(e.currentTarget)}
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none', color: 'text.primary', gap: 1, px: 1.5, py: 0.75,
                borderRadius: '10px', border: '1px solid rgba(0,0,0,0.09)',
                bgcolor: 'white',
                '&:hover': { bgcolor: '#F3F4F6', borderColor: 'rgba(0,0,0,0.15)' },
              }}
            >
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#2563EB', fontSize: '0.7rem', fontWeight: 700 }}>
                {getInitials(user.name)}
              </Avatar>
              <Typography variant="body2" fontWeight={500} sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.name}
              </Typography>
            </Button>
          </Tooltip>

          <Menu
            anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 210, borderRadius: 3, border: '1px solid rgba(0,0,0,0.07)' } }}
          >
            <Box sx={{ px: 2.5, py: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => setAnchor(null)} component={Link} to="/" sx={{ py: 1.25 }}>
              <ListItemIcon><CalendarMonthIcon fontSize="small" /></ListItemIcon>
              <ListItemText>My Availability</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.25 }}>
              <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
              <ListItemText>Sign out</ListItemText>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button component={Link} to="/login" variant="contained" size="small" startIcon={<LoginIcon />}>
          Sign in
        </Button>
      )}
    </Box>
  );
}