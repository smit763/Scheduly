import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookingLink, fetchBookedSlots,
  resetBookedSlots, resetBookingSuccess,
} from '../store/slices/bookingSlice';
import Navbar from '../components/common/Navbar';
import BookingCalendar from '../components/booking/BookingCalendar';
import TimeSlots from '../components/booking/TimeSlots';
import BookingForm from '../components/booking/BookingForm';
import { formatSlotLabel } from '../utils/timeUtils';

export default function BookingPage() {
  const { uniqueId } = useParams();
  const dispatch = useDispatch();
  const { linkData, linkLoading, linkError, bookedSlots, slotsLoading, bookedSlot } =
    useSelector((s) => s.booking);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => { dispatch(fetchBookingLink(uniqueId)); }, [uniqueId, dispatch]);

  const availability   = linkData?.availabilityId;
  const availableDates = availability?.date
    ? [availability.date].filter((d) => dayjs(d).isSameOrAfter(dayjs(), 'day'))
    : [];

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const first = dayjs(availableDates[0]);
      if (first.isSameOrAfter(dayjs(), 'day')) setSelectedDate(first);
    }
  }, [availability]);

  useEffect(() => {
    if (selectedDate && linkData) {
      dispatch(resetBookedSlots());
      setSelectedSlot(null);
      dispatch(fetchBookedSlots({ bookingLinkId: uniqueId, date: selectedDate.format('YYYY-MM-DD') }));
    }
  }, [selectedDate, linkData, uniqueId, dispatch]);

  const handleDateSelect = (date) => {
    if (bookedSlot) dispatch(resetBookingSuccess());
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    if (bookedSlot) dispatch(resetBookingSuccess());
    setSelectedSlot(slot);
  };

  if (linkLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8F7F4' }}>
        <Navbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 2 }}>
          <CircularProgress size={36} thickness={3} />
          <Typography variant="body2" color="text.secondary">Loading booking page…</Typography>
        </Box>
      </Box>
    );
  }

  if (linkError) return <Navigate to="/404" replace />;

  const selectedDateStr     = selectedDate ? selectedDate.format('YYYY-MM-DD') : null;
  const matchedAvailability = selectedDateStr === availability?.date ? availability : null;
  const showForm            = selectedSlot && !bookedSlot;
  const showConfirm         = !!bookedSlot;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F7F4' }}>
      <Navbar />

      <Box
        sx={{
          background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 45%, #4F46E5 100%)',
          pt: { xs: 5, md: 6 }, pb: { xs: 7, md: 9 }, px: 3, position: 'relative', overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -30, left: '20%', width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box className="fade-up">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CalendarMonthIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Booking
              </Typography>
            </Box>
            <Typography sx={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: { xs: '1.9rem', md: '2.4rem' }, fontWeight: 400, lineHeight: 1.2, mb: 1 }}>
              Book a Meeting
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem' }}>
              Pick a date, choose a time slot, and confirm your details.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 8, px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, alignItems: 'start' }}>

          <BookingCalendar
            availableDates={availableDates}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TimeSlots
              startTime={matchedAvailability?.startTime}
              endTime={matchedAvailability?.endTime}
              bookedSlots={bookedSlots}
              slotsLoading={slotsLoading}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelect}
              selectedDate={selectedDate}
              hasAvailability={!!matchedAvailability}
            />

            {(showForm || showConfirm) && (
              <BookingForm
                bookingLinkId={uniqueId}
                date={selectedDateStr}
                timeSlot={selectedSlot}
                onBookAnother={() => setSelectedSlot(null)}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}