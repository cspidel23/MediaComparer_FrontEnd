import { useRef, useState } from 'react';

// next
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// project import
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import IconButton from 'components/@extended/IconButton';

import useUser from 'hooks/useUser';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const theme = useTheme();
  const user = useUser();
  const router = useRouter();

  const handleLogout = () => {
    signOut({ redirect: false });
    router.push('/login');
  };

  const handleAccountSettings = () => {
    setOpen(false);          // close the popper
    router.push('/account'); // go to your Account Settings page
  };

  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={(theme) => ({
          p: 0.25,
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'secondary.lighter',
            ...theme.applyStyles('dark', {
              bgcolor: 'secondary.light'
            })
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2
          }
        })}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        {user && (
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 0.5 }}>
            <Avatar alt={user.name} src={user.avatar} size="sm" />
            <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
              {user.name && user.name}
            </Typography>
          </Stack>
        )}
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: 290,
                minWidth: 240,
                maxWidth: { xs: 250, md: 290 }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  {/* Top section: avatar + email + logout icon */}
                  <CardContent sx={{ px: 2.5, pt: 3, pb: 2 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        {user && (
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt={user.name} src={user.avatar} />
                            <Stack>
                              <Typography variant="h6">{user.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Stack>
                          </Stack>
                        )}
                      </Grid>
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton size="large" sx={{ color: 'text.primary' }} onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  {/* Bottom section: Account Settings button */}
                  <CardContent sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      startIcon={<SettingOutlined />}
                      onClick={handleAccountSettings}
                    >
                      Account Settings
                    </Button>
                  </CardContent>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
