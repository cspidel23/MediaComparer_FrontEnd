'use client';

import * as React from 'react';
import { Box, Container, Typography, Tabs, Tab, Paper } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';

// project imports
import AddMovieForm from './forms/add-movie-form';
import AddTVShowForm from './forms/add-tvshow-form';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`media-tabpanel-${index}`} aria-labelledby={`media-tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `media-tab-${index}`,
    'aria-controls': `media-tabpanel-${index}`
  };
}

export default function AddMediaForm() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          Add New Media
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Add a new movie or TV show to your catalog
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="media type tabs"
          centered
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }
          }}
        >
          <Tab
            icon={<MovieIcon />}
            iconPosition="start"
            label="Add Movie"
            {...a11yProps(0)}
            sx={{
              minHeight: 72,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none'
            }}
          />
          <Tab
            icon={<TvIcon />}
            iconPosition="start"
            label="Add TV Show"
            {...a11yProps(1)}
            sx={{
              minHeight: 72,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none'
            }}
          />
        </Tabs>

        {/* Movie Form */}
        <TabPanel value={tabValue} index={0}>
          <AddMovieForm />
        </TabPanel>

        {/* TV Show Form */}
        <TabPanel value={tabValue} index={1}>
          <AddTVShowForm />
        </TabPanel>
      </Paper>
    </Container>
  );
}
