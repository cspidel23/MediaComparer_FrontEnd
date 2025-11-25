'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface NetworkInfoProps {
  name: string;
  logo: string;
}

export default function NetworkInfo({ name, logo }: NetworkInfoProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {!imageError && logo && (
        <Box
          component="img"
          src={logo}
          alt={name}
          onError={() => setImageError(true)}
          sx={{ height: 40, objectFit: 'contain', bgcolor: 'white', p: 1, borderRadius: 1 }}
        />
      )}
      <Typography variant="body1">{name}</Typography>
    </Box>
  );
}
