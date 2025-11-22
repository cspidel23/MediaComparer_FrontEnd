'use client';

import { FormEvent, useState } from 'react';

// MUI
import { Grid, Stack, TextField, Typography, Button, Alert, CircularProgress } from '@mui/material';

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    try {
      setSubmitting(true);

      // adjust if your token is stored differently
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || 'Unable to update password.');
      }

      setSuccessMsg('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8} lg={6}>
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Stack spacing={0.5}>
            <Typography variant="h4">Account Settings</Typography>
            <Typography variant="body2" color="text.secondary">
              Change the password for your MediaComparer account.
            </Typography>
          </Stack>

          {successMsg && <Alert severity="success">{successMsg}</Alert>}
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          <Stack
            component="form"
            spacing={2.5}
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
            />

            <TextField
              label="New password"
              type="password"
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Use at least 8 characters, including a mix of letters and numbers."
            />

            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={1}>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={submitting}
              >
                {submitting ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CircularProgress size={18} />
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
  );
}

