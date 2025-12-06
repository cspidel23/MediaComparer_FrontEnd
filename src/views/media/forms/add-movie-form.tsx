'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// project imports
import { movieApi } from 'services/movieApi';

interface MovieFormData {
  title: string;
  original_title: string;
  release_year: number | string;
  runtime_minutes: number | string;
  rating: string;
  mpa_rating: string;
  box_office: string;
  budget: string;
  director_id: number | string;
  director_name: string;
  country_id: number | string;
  overview: string;
  genres: string;
  studios: string;
  poster_url: string;
  backdrop_url: string;
  collection: string;
  actors: string;
}

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

export default function AddMovieForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState<MovieFormData>({
    title: '',
    original_title: '',
    release_year: '',
    runtime_minutes: '',
    rating: '',
    mpa_rating: '',
    box_office: '',
    budget: '',
    director_id: '',
    director_name: '',
    country_id: '',
    overview: '',
    genres: '',
    studios: '',
    poster_url: '',
    backdrop_url: '',
    collection: '',
    actors: '[]'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.title || !formData.release_year) {
        throw new Error('Please fill in all required fields (Title, Release Year)');
      }

      // Prepare data for API
      const movieData = {
        title: formData.title,
        release_year: Number(formData.release_year),
        runtime_minutes: formData.runtime_minutes ? Number(formData.runtime_minutes) : undefined,
        rating: formData.rating || undefined,
        box_office: formData.box_office || undefined,
        director_id: formData.director_id ? Number(formData.director_id) : undefined,
        country_id: formData.country_id ? Number(formData.country_id) : undefined,
        overview: formData.overview || undefined,
        budget: formData.budget || undefined,
        studios: formData.studios || undefined,
        poster_url: formData.poster_url || undefined,
        backdrop_url: formData.backdrop_url || undefined,
        collection: formData.collection || undefined,
        original_title: formData.original_title || undefined,
        mpa_rating: formData.mpa_rating || undefined
      };

      // Call API
      await movieApi.createMovie(movieData);

      setSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: '',
          original_title: '',
          release_year: '',
          runtime_minutes: '',
          rating: '',
          mpa_rating: '',
          box_office: '',
          budget: '',
          director_id: '',
          director_name: '',
          country_id: '',
          overview: '',
          genres: '',
          studios: '',
          poster_url: '',
          backdrop_url: '',
          collection: '',
          actors: '[]'
        });
        setSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add movie. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/catalog');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ px: { xs: 2, sm: 4 }, pb: 3 }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Movie added successfully!
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Basic Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., The Matrix"
                sx={{
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
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Original Title"
                name="original_title"
                value={formData.original_title}
                onChange={handleChange}
                placeholder="e.g., The Matrix"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Overview"
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Enter a brief description of the movie..."
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Release & Duration */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Release & Duration
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                type="number"
                label="Release Year"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                placeholder="e.g., 1999"
                inputProps={{ min: 1900, max: 2100 }}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Runtime (minutes)"
                name="runtime_minutes"
                value={formData.runtime_minutes}
                onChange={handleChange}
                placeholder="e.g., 136"
                inputProps={{ min: 1 }}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="MPA Rating"
                name="mpa_rating"
                value={formData.mpa_rating}
                onChange={handleChange}
                placeholder="e.g., R, PG-13, PG"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="Additional rating info"
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Director & Production */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Director & Production
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Director Name"
                name="director_name"
                value={formData.director_name}
                onChange={handleChange}
                placeholder="e.g., Christopher Nolan"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Director ID"
                name="director_id"
                value={formData.director_id}
                onChange={handleChange}
                placeholder="Optional"
                inputProps={{ min: 1 }}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Country ID"
                name="country_id"
                value={formData.country_id}
                onChange={handleChange}
                placeholder="Country ID"
                inputProps={{ min: 1 }}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Studios"
                name="studios"
                value={formData.studios}
                onChange={handleChange}
                placeholder="Semicolon-separated (e.g., Warner Bros;Legendary Pictures)"
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Financial Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Financial Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={textFieldStyles}>
                <InputLabel>Box Office</InputLabel>
                <OutlinedInput
                  name="box_office"
                  value={formData.box_office}
                  onChange={handleChange}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  placeholder="e.g., 467,222,728"
                  label="Box Office"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={textFieldStyles}>
                <InputLabel>Budget</InputLabel>
                <OutlinedInput
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  placeholder="e.g., 63,000,000"
                  label="Budget"
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Media & Categorization */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Media & Categorization
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Genres"
                name="genres"
                value={formData.genres}
                onChange={handleChange}
                placeholder="Comma-separated (e.g., Action, Sci-Fi, Thriller)"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Collection"
                name="collection"
                value={formData.collection}
                onChange={handleChange}
                placeholder="e.g., The Matrix Collection"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Poster URL"
                name="poster_url"
                value={formData.poster_url}
                onChange={handleChange}
                placeholder="https://image.tmdb.org/t/p/w500/..."
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Backdrop URL"
                name="backdrop_url"
                value={formData.backdrop_url}
                onChange={handleChange}
                placeholder="https://image.tmdb.org/t/p/w500/..."
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Cast Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Cast Information
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Actors (JSON Array)"
            name="actors"
            value={formData.actors}
            onChange={handleChange}
            placeholder='[{"name": "Keanu Reeves", "character": "Neo"}]'
            helperText="Enter as a JSON array of objects"
            sx={textFieldStyles}
          />
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={loading}
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={loading}
            size="large"
            sx={{
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
            {loading ? 'Adding...' : 'Add Movie'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
