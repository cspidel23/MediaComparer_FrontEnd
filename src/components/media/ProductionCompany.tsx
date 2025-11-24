'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface ProductionCompanyProps {
  name: string;
  logo: string;
}

export default function ProductionCompany({ name, logo }: ProductionCompanyProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <Box sx={{ textAlign: 'center', minWidth: 100 }}>
      {!imageError && logo && (
        <Box
          component="img"
          src={logo}
          alt={name}
          onError={() => setImageError(true)}
          sx={{
            height: 50,
            maxWidth: 120,
            objectFit: 'contain',
            bgcolor: 'white',
            p: 1,
            borderRadius: 1,
            mb: 1
          }}
        />
      )}
      <Typography variant={imageError ? 'body2' : 'caption'} display="block" sx={{ fontWeight: imageError ? 500 : 400 }}>
        {name}
      </Typography>
    </Box>
  );
}
