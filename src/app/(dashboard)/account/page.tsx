'use client';

import { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';

// MUI
import Grid from '@mui/material/Grid';
import {
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Box,
  Container
} from '@mui/material';

// Shared TextField styling from catalog page
const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'background.paper',
    borderRadius: 2,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'action.hover',
      boxShadow: 2
    },
    '&.Mui-focused': {
      backgroundColor: 'background.paper',
      boxShadow: 3,
      '& fieldset': {
        borderWidth: 2
      }
    }
  }
};

export default function AccountPage() {
  const { data: session } = useSession();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    // ✅ Get the real JWT from the NextAuth session
    const accessToken = (session as any)?.token?.accessToken as string | undefined;

    if (!accessToken) {
      setErrorMsg('Auth token is not available. Please sign in again.');
      return;
    }

    try {
      setSubmitting(true);

      // ✅ Use the correct endpoint AND correct field names
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user/password/change`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            oldPassword: currentPassword,
            newPassword: newPassword
          })
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || 'Unable to update password.');
      }

      setSuccessMsg(data?.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 5,
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
          borderRadius: 3,
          py: 4,
          px: 2
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800,
            mb: 1,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Change the password for your MediaComparer account
        </Typography>
      </Box>

      <Grid container justifyContent="center">
        <Grid xs={12}>
          <Stack spacing={3}>

          {/* Alerts */}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          {/* Form */}
          <Stack
            component="form"
            spacing={3}
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              label="Current password"
              type="password"
              fullWidth
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={textFieldStyles}
            />

            <TextField
              label="New password"
              type="password"
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Use at least 8 characters with a mix of letters and numbers."
              sx={textFieldStyles}
            />

            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={textFieldStyles}
            />

            <Stack direction="row" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                size="large"
                sx={{
                  minWidth: 200,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
              >
                {submitting ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CircularProgress size={18} color="inherit" />
                    <span>Updating…</span>
                  </Stack>
                ) : (
                  'Change Password'
                )}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
    </Container>
  );
}


