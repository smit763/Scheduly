import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography,
  CircularProgress, InputAdornment, Collapse, Alert,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking, clearBookingMessages, resetBookingSuccess } from '../../store/slices/bookingSlice';
import { formatDate, formatSlotLabel } from '../../utils/timeUtils';

export default function BookingForm({ bookingLinkId, date, timeSlot, onBookAnother }) {
  const dispatch = useDispatch();
  const { bookingLoading, bookingError, bookedSlot, bookerName } = useSelector((s) => s.booking);

  const [name,   setName]   = useState('');
  const [email,  setEmail]  = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim())                                    e.name  = 'Name is required';
    if (!email.trim())                                   e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const cardHeader = (title, subtitle, icon, iconBg) => (
    <Box sx={{
      px: { xs: 3, md: 4 }, py: 2.5,
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      background: 'linear-gradient(to right, #FAFAFA, #F5F4F1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Box>
        <Typography variant="h6" sx={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400, fontSize: '1.2rem' }}>
          {title}
        </Typography>
        {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
      </Box>
      <Box sx={{
        width: 38, height: 38, borderRadius: '11px',
        background: iconBg || 'linear-gradient(135deg, #2563EB, #4F46E5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 3px 10px rgba(37,99,235,0.25)',
      }}>
        {React.cloneElement(icon, { sx: { color: '#fff', fontSize: 18 } })}
      </Box>
    </Box>
  );

  if (bookedSlot) {
    return (
      <Box
        className="fade-up"
        sx={{
          bgcolor: 'white', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 4, overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}
      >
        {cardHeader('Booking Confirmed!', 'See you then', <CheckCircleIcon />, 'linear-gradient(135deg, #16A34A, #15803D)')}

        <Box sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '18px',
            background: 'linear-gradient(135deg, #16A34A, #15803D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2.5,
            boxShadow: '0 6px 20px rgba(22,163,74,0.3)',
          }}>
            <CheckCircleIcon sx={{ color: '#fff', fontSize: 32 }} />
          </Box>

          <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.5rem', fontWeight: 400, mb: 0.5 }}>
            You're all set, {bookerName?.split(' ')[0]}!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your meeting has been booked successfully.
          </Typography>

          <Box sx={{
            display: 'flex', flexDirection: 'column', gap: 1.5,
            bgcolor: '#F9FAFB', borderRadius: 3, p: 2.5,
            border: '1px solid #E5E7EB', mb: 3, textAlign: 'left',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '9px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CalendarMonthIcon sx={{ fontSize: 16, color: '#2563EB' }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Date</Typography>
                <Typography variant="body2" fontWeight={600}>{formatDate(date)}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '9px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: '#2563EB' }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Time</Typography>
                <Typography variant="body2" fontWeight={600}>{formatSlotLabel(bookedSlot)}</Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="outlined" onClick={() => { dispatch(resetBookingSuccess()); onBookAnother?.(); }}
            sx={{ borderRadius: 2.5 }}
          >
            Book another slot
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className="fade-up"
      sx={{
        bgcolor: 'white', border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 4, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {cardHeader('Your Details', `Booking for ${formatSlotLabel(timeSlot)}`, <PersonOutlineIcon />)}

      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          bgcolor: '#EFF6FF', borderRadius: 2.5, p: 2, mb: 3,
          border: '1px solid #BFDBFE',
        }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '9px', bgcolor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AccessTimeIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Selected slot</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: '#1D4ED8' }}>
              {formatDate(date)} · {formatSlotLabel(timeSlot)}
            </Typography>
          </Box>
        </Box>

        <Collapse in={!!bookingError}>
          <Alert severity="error" onClose={() => dispatch(clearBookingMessages())} sx={{ mb: 3, borderRadius: 2 }}>
            {bookingError}
          </Alert>
        </Collapse>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Your Name" value={name} fullWidth placeholder="Jane Smith"
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name} helperText={errors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Your Email" type="email" value={email} fullWidth placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email} helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained" fullWidth size="large"
            onClick={() => { if (validate()) dispatch(createBooking({ bookingLinkId, date, timeSlot, bookerName: name, bookerEmail: email })); }}
            disabled={bookingLoading}
            endIcon={bookingLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForwardIcon />}
            sx={{ py: 1.5, borderRadius: 2.5, mt: 0.5 }}
          >
            {bookingLoading ? 'Confirming…' : 'Confirm Booking'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}