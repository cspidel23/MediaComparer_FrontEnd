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
  CircularProgress
} from '@mui/material';

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
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid xs={12} md={8} lg={6}>
        <Stack spacing={3}>
          {/* Page Title */}
          <Stack spacing={0.5}>
            <Typography variant="h4">Account Settings</Typography>
            <Typography variant="body2" color="text.secondary">
              Change the password for your MediaComparer account.
            </Typography>
          </Stack>

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
            />

            <TextField
              label="New password"
              type="password"
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Use at least 8 characters with a mix of letters and numbers."
            />

            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Stack direction="row" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={submitting}
                sx={{ minWidth: 160 }}
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


