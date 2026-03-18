import React, { useState } from 'react';
import {
  Box, Typography, Button, CircularProgress,
  Tooltip, IconButton, Snackbar, Alert, Collapse,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useDispatch, useSelector } from 'react-redux';
import { generateLink, deleteAvailability, clearMessages } from '../../store/slices/availabilitySlice';
import { formatSlotLabel } from '../../utils/timeUtils';

const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function DateBadge({ dateStr }) {
  const d = new Date(dateStr + 'T00:00:00');
  const isToday    = new Date().toDateString() === d.toDateString();
  const isTomorrow = (() => { const t = new Date(); t.setDate(t.getDate()+1); return t.toDateString() === d.toDateString(); })();
  const isPast     = d < new Date();

  return (
    <Box sx={{
      width: 56, height: 64, borderRadius: 2.5, flexShrink: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      bgcolor: isPast ? '#F3F4F6' : '#EFF6FF',
      border: `1.5px solid ${isPast ? '#E5E7EB' : '#BFDBFE'}`,
    }}>
      <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: isPast ? '#9CA3AF' : '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>
        {MONTH_NAMES[d.getMonth()]}
      </Typography>
      <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: isPast ? '#6B7280' : '#1D4ED8', lineHeight: 1.1, fontFamily: 'DM Sans' }}>
        {d.getDate()}
      </Typography>
      <Typography sx={{ fontSize: '0.6rem', color: isPast ? '#9CA3AF' : '#3B82F6', fontWeight: 600, letterSpacing: '0.04em' }}>
        {isToday ? 'TODAY' : isTomorrow ? 'TMR' : DAY_NAMES[d.getDay()]}
      </Typography>
    </Box>
  );
}

function SkeletonCard() {
  return (
    <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 2.5, border: '1px solid rgba(0,0,0,0.07)', display: 'flex', gap: 2, alignItems: 'center' }}>
      <Box className="skeleton-shimmer" sx={{ width: 56, height: 64, borderRadius: 2.5, flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Box className="skeleton-shimmer" sx={{ height: 16, width: '55%', borderRadius: 1, mb: 1 }} />
        <Box className="skeleton-shimmer" sx={{ height: 13, width: '35%', borderRadius: 1, mb: 1 }} />
        <Box className="skeleton-shimmer" sx={{ height: 13, width: '70%', borderRadius: 1 }} />
      </Box>
      <Box className="skeleton-shimmer" sx={{ width: 110, height: 34, borderRadius: 2, flexShrink: 0 }} />
    </Box>
  );
}

export default function AvailabilityList() {
  const dispatch = useDispatch();
  const { list, fetching, fetchError, generatingLinkId, linkError, deletingId } = useSelector((s) => s.availability);
  const [copyToast, setCopyToast] = useState(false);
  const [copiedId,  setCopiedId]  = useState(null);

  const getFullUrl = (url) => `${window.location.origin}${url}`;

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(getFullUrl(url));
    setCopiedId(id);
    setCopyToast(true);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDuration = (s, e) => {
    const [sh, sm] = s.split(':').map(Number);
    const [eh, em] = e.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    const h = Math.floor(diff / 60), m = diff % 60;
    return `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m` : ''}`.trim();
  };

  const getSlotCount = (s, e) => {
    const [sh, sm] = s.split(':').map(Number);
    const [eh, em] = e.split(':').map(Number);
    return Math.floor(((eh * 60 + em) - (sh * 60 + sm)) / 30);
  };

  if (fetching) {
    return (
      <Box sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <Box sx={{ px: { xs: 3, md: 4 }, py: 2.5, borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'linear-gradient(to right, #FAFAFA, #F5F4F1)' }}>
          <Box className="skeleton-shimmer" sx={{ height: 22, width: 180, borderRadius: 1 }} />
        </Box>
        <Box sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1,2,3].map((i) => <SkeletonCard key={i} />)}
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{
        bgcolor: 'white',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}>
        <Box sx={{
          px: { xs: 3, md: 4 }, py: 2.5,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: 'linear-gradient(to right, #FAFAFA, #F5F4F1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400, fontSize: '1.2rem' }}>
              Your Availability
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {list.length > 0 ? `${list.length} slot${list.length !== 1 ? 's' : ''} saved` : 'No slots yet'}
            </Typography>
          </Box>
          {list.length > 0 && (
            <Box sx={{
              px: 1.5, py: 0.5, borderRadius: 10,
              bgcolor: '#EFF6FF', border: '1px solid #BFDBFE',
            }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB' }}>
                {list.filter((i) => i.generatedLink).length}/{list.length} linked
              </Typography>
            </Box>
          )}
        </Box>

        <Collapse in={!!fetchError}>
          <Box sx={{ px: { xs: 3, md: 4 }, pt: 3 }}>
            <Alert severity="error" onClose={() => dispatch(clearMessages())} sx={{ borderRadius: 2 }}>
              {fetchError}
            </Alert>
          </Box>
        </Collapse>

        <Collapse in={!!linkError}>
          <Box sx={{ px: { xs: 3, md: 4 }, pt: 3 }}>
            <Alert severity="error" onClose={() => dispatch(clearMessages())} sx={{ borderRadius: 2 }}>
              {linkError}
            </Alert>
          </Box>
        </Collapse>

        {list.length === 0 ? (
          <Box sx={{ px: 4, py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 72, height: 72, borderRadius: '20px',
              bgcolor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <EventBusyIcon sx={{ fontSize: 34, color: '#D1D5DB' }} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>No availability yet</Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first slot using the form above.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {list.map((item, idx) => {
              const isDeleting   = deletingId   === item._id;
              const isGenerating = generatingLinkId === item._id;
              const isCopied     = copiedId === item._id;
              const slotCount    = getSlotCount(item.startTime, item.endTime);
              const duration     = getDuration(item.startTime, item.endTime);
              const isPast       = new Date(item.date + 'T00:00:00') < new Date();

              return (
                <Box
                  key={item._id}
                  className="avail-card fade-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  sx={{
                    bgcolor: isPast ? '#FAFAF9' : 'white',
                    border: `1px solid ${item.generatedLink ? '#BFDBFE' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 3,
                    p: { xs: 2, md: 2.5 },
                    opacity: isDeleting ? 0.45 : 1,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    ...(item.generatedLink && !isPast && {
                      '&::before': {
                        content: '""', position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: 3, bgcolor: '#2563EB', borderRadius: '3px 0 0 3px',
                      },
                    }),
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                    <DateBadge dateStr={item.date} />

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" fontWeight={600}>
                            {formatSlotLabel(item.startTime)} – {formatSlotLabel(item.endTime)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.75 }}>
                          <Box className="stat-badge" sx={{ bgcolor: '#F0FDF4', color: '#15803D' }}>
                            {duration}
                          </Box>
                          <Box className="stat-badge" sx={{ bgcolor: '#FEF9C3', color: '#854D0E' }}>
                            {slotCount} slot{slotCount !== 1 ? 's' : ''}
                          </Box>
                          {isPast && (
                            <Box className="stat-badge" sx={{ bgcolor: '#F3F4F6', color: '#6B7280' }}>
                              Past
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {item.generatedLink ? (
                        <Box sx={{
                          display: 'flex', alignItems: 'center', gap: 1, mt: 1,
                          bgcolor: '#EFF6FF', borderRadius: 1.5, px: 1.5, py: 0.75,
                          border: '1px solid #DBEAFE',
                        }}>
                          <CheckIcon sx={{ fontSize: 13, color: '#2563EB', flexShrink: 0 }} />
                          <Typography
                            className="link-pill"
                            sx={{
                              flex: 1, minWidth: 0,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              color: '#1D4ED8', fontSize: '0.75rem',
                            }}
                          >
                            {getFullUrl(item.generatedLink)}
                          </Typography>
                          <Tooltip title={isCopied ? 'Copied!' : 'Copy link'}>
                            <IconButton size="small" onClick={() => handleCopy(item.generatedLink, item._id)} sx={{ p: 0.5 }}>
                              {isCopied
                                ? <CheckIcon sx={{ fontSize: 14, color: '#16A34A' }} />
                                : <ContentCopyIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                              }
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Open booking page">
                            <IconButton
                              size="small" component="a"
                              href={item.generatedLink} target="_blank" rel="noopener noreferrer"
                              sx={{ p: 0.5 }}
                            >
                              <OpenInNewIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Button
                          variant="outlined" size="small"
                          startIcon={isGenerating ? <CircularProgress size={12} /> : <LinkIcon sx={{ fontSize: 14 }} />}
                          onClick={() => dispatch(generateLink({ availabilityId: item._id }))}
                          disabled={isGenerating || isDeleting}
                          sx={{ mt: 1, borderRadius: 2, fontSize: '0.8rem', py: 0.6, px: 1.75 }}
                        >
                          {isGenerating ? 'Generating...' : 'Generate booking link'}
                        </Button>
                      )}
                    </Box>

                    <Tooltip title="Delete slot">
                      <IconButton
                        size="small"
                        onClick={() => dispatch(deleteAvailability(item._id))}
                        disabled={isDeleting}
                        sx={{ color: 'error.main', flexShrink: 0, mt: 0.25 }}
                      >
                        {isDeleting
                          ? <CircularProgress size={14} color="error" />
                          : <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        }
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <Snackbar
        open={copyToast} autoHideDuration={2000}
        onClose={() => setCopyToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}