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
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// project imports
import { tvApi } from 'services/tvApi';

interface TVShowFormData {
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date: string;
  seasons: number | string;
  episodes: number | string;
  status: string;
  overview: string;
  popularity: number | string;
  tmdb_rating: number | string;
  vote_count: number | string;
  creators: string;
  poster_url: string;
  backdrop_url: string;
  genres: number[];
  network_id: number | string;
  network_name: string;
  network_logo: string;
  network_country: string;
  companies: string;
  actors: string;
}

const SHOW_STATUSES = [
  'Returning Series',
  'Ended',
  'Canceled',
  'In Production',
  'Planned',
  'Pilot'
];

export default function AddTVShowForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [availableGenres, setAvailableGenres] = React.useState<{ genre_id: number; name: string }[]>([]);

  const [formData, setFormData] = React.useState<TVShowFormData>({
    name: '',
    original_name: '',
    first_air_date: '',
    last_air_date: '',
    seasons: '',
    episodes: '',
    status: 'Returning Series',
    overview: '',
    popularity: '',
    tmdb_rating: '',
    vote_count: '',
    creators: '',
    poster_url: '',
    backdrop_url: '',
    genres: [],
    network_id: '',
    network_name: '',
    network_logo: '',
    network_country: '',
    companies: '',
    actors: '[]'
  });

  // Fetch available genres on mount
  React.useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tvApi.getGenres();
        setAvailableGenres(response.data.data);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenresChange = (e: SelectChangeEvent<number[]>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      genres: typeof value === 'string' ? [] : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.name || !formData.first_air_date || !formData.seasons || !formData.episodes) {
        throw new Error('Please fill in all required fields (Name, First Air Date, Seasons, Episodes)');
      }

      // TODO: Replace with actual API call when endpoint is available
      // For now, we'll just simulate a successful submission
      console.log('TV Show data to submit:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          original_name: '',
          first_air_date: '',
          last_air_date: '',
          seasons: '',
          episodes: '',
          status: 'Returning Series',
          overview: '',
          popularity: '',
          tmdb_rating: '',
          vote_count: '',
          creators: '',
          poster_url: '',
          backdrop_url: '',
          genres: [],
          network_id: '',
          network_name: '',
          network_logo: '',
          network_country: '',
          companies: '',
          actors: '[]'
        });
        setSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add TV show. Please try again.');
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
          TV Show added successfully!
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
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Breaking Bad"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Original Name"
                name="original_name"
                value={formData.original_name}
                onChange={handleChange}
                placeholder="e.g., Breaking Bad"
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
                placeholder="Enter a brief description of the TV show..."
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Air Date & Status */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Air Date & Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                type="date"
                label="First Air Date"
                name="first_air_date"
                value={formData.first_air_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Last Air Date"
                name="last_air_date"
                value={formData.last_air_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  {SHOW_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Seasons & Episodes */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Seasons & Episodes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Number of Seasons"
                name="seasons"
                value={formData.seasons}
                onChange={handleChange}
                placeholder="e.g., 5"
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Number of Episodes"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                placeholder="e.g., 62"
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Creators */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Creators
          </Typography>
          <TextField
            fullWidth
            label="Creators"
            name="creators"
            value={formData.creators}
            onChange={handleChange}
            placeholder="Comma-separated (e.g., Vince Gilligan, Peter Gould)"
            helperText="Enter creator names separated by commas"
          />
        </Box>

        <Divider />

        {/* Ratings & Popularity */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Ratings & Popularity
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="TMDB Rating"
                name="tmdb_rating"
                value={formData.tmdb_rating}
                onChange={handleChange}
                placeholder="e.g., 8.9"
                inputProps={{ min: 0, max: 10, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Vote Count"
                name="vote_count"
                value={formData.vote_count}
                onChange={handleChange}
                placeholder="e.g., 13456"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Popularity"
                name="popularity"
                value={formData.popularity}
                onChange={handleChange}
                placeholder="e.g., 412.567"
                inputProps={{ min: 0, step: 0.001 }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Network Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Network Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Network Name"
                name="network_name"
                value={formData.network_name}
                onChange={handleChange}
                placeholder="e.g., AMC, Netflix, HBO"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Network ID"
                name="network_id"
                value={formData.network_id}
                onChange={handleChange}
                placeholder="Optional"
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Network Logo URL"
                name="network_logo"
                value={formData.network_logo}
                onChange={handleChange}
                placeholder="https://image.tmdb.org/t/p/w500/..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Network Country"
                name="network_country"
                value={formData.network_country}
                onChange={handleChange}
                placeholder="e.g., US, UK, CA"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Genres & Companies */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Genres & Production
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Genres</InputLabel>
                <Select
                  multiple
                  name="genres"
                  value={formData.genres}
                  onChange={handleGenresChange}
                  input={<OutlinedInput label="Genres" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((genreId) => {
                        const genre = availableGenres.find((g) => g.genre_id === genreId);
                        return <Chip key={genreId} label={genre?.name || genreId} size="small" />;
                      })}
                    </Box>
                  )}
                >
                  {availableGenres.map((genre) => (
                    <MenuItem key={genre.genre_id} value={genre.genre_id}>
                      {genre.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Production Companies"
                name="companies"
                value={formData.companies}
                onChange={handleChange}
                placeholder="Semicolon-separated (e.g., High Bridge Productions;Sony Pictures Television)"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Media URLs */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Media & Images
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Poster URL"
                name="poster_url"
                value={formData.poster_url}
                onChange={handleChange}
                placeholder="https://image.tmdb.org/t/p/w500/..."
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
            placeholder='[{"name": "Bryan Cranston", "character": "Walter White", "order_num": 1}]'
            helperText="Enter as a JSON array of objects with name, character, and order_num"
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
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={loading}
            size="large"
          >
            {loading ? 'Adding...' : 'Add TV Show'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
