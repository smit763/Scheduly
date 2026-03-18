import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';
import { fetchAvailability } from '../store/slices/availabilitySlice';
import Navbar from '../components/common/Navbar';
import AvailabilityForm from '../components/availability/AvailabilityForm';
import AvailabilityList from '../components/availability/AvailabilityList';

function StatCard({ icon, label, value, color }) {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: 3,
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flex: 1,
        minWidth: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <Box sx={{
        width: 42, height: 42, borderRadius: '12px',
        bgcolor: color + '15', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2, fontFamily: 'DM Sans' }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AvailabilityPage() {
  const dispatch  = useDispatch();
  const { user }  = useSelector(selectAuth);
  const { list }  = useSelector((s) => s.availability);

  useEffect(() => { dispatch(fetchAvailability()); }, [dispatch]);

  const totalSlots   = list.length;
  const linkedSlots  = list.filter((i) => i.generatedLink).length;
  const totalHours   = list.reduce((acc, item) => {
    const [sh, sm] = item.startTime.split(':').map(Number);
    const [eh, em] = item.endTime.split(':').map(Number);
    return acc + ((eh * 60 + em - sh * 60 - sm) / 60);
  }, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F7F4' }}>
      <Navbar />

      <Box
        className="hero-gradient"
        sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 8, md: 10 }, px: 3, position: 'relative', overflow: 'hidden' }}
      >
        <Box sx={{
          position: 'absolute', top: -60, right: -60, width: 280, height: 280,
          borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -40, left: '30%', width: 180, height: 180,
          borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Box className="fade-up">
            <Typography
              variant="overline"
              sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', fontSize: '0.7rem', fontWeight: 600 }}
            >
              Dashboard
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontWeight: 400, mt: 0.5, mb: 1, lineHeight: 1.2 }}
            >
              Good to see you,<br />{user?.name?.split(' ')[0]} 👋
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', maxWidth: 420 }}>
              Manage your availability slots and share booking links — all in one place.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -4, pb: 8, px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }} className="fade-up">
          <StatCard icon={<EventAvailableIcon />} label="Total slots" value={totalSlots} color="#2563EB" />
          <StatCard icon={<LinkIcon />}           label="Links generated" value={linkedSlots} color="#4F46E5" />
          <StatCard icon={<AccessTimeIcon />}     label="Hours available" value={totalHours.toFixed(1)} color="#0891B2" />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AvailabilityForm />
          </Grid>
          <Grid item xs={12}>
            <AvailabilityList />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}