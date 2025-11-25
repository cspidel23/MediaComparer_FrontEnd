'use client';

import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface ActorCardProps {
  name: string;
  character: string;
  profileUrl: string;
}

export default function ActorCard({ name, character, profileUrl }: ActorCardProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <Card variant="outlined">
      {!imageError && profileUrl ? (
        <Box
          component="img"
          src={profileUrl}
          alt={name}
          onError={() => setImageError(true)}
          sx={{
            width: '100%',
            aspectRatio: '2/3',
            objectFit: 'cover'
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            aspectRatio: '2/3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'action.hover'
          }}
        >
          <PersonIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
        </Box>
      )}
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {character}
        </Typography>
      </CardContent>
    </Card>
  );
}
