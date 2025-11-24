'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Rating,
  Stack,
  TextField,
  InputAdornment,
  CardActions,
  Button,
  IconButton,
  Fab,
  Zoom,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// project import
import { Media, Genre } from 'app/mock/media';
import { tvApi } from 'services/tvApi';
import { movieApi } from 'services/movieApi';

export default function MediaList() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedGenres, setSelectedGenres] = React.useState<number[]>([]);

  // API state for TV shows
  const [tvShows, setTvShows] = React.useState<Media[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalTVShows, setTotalTVShows] = React.useState<number>(0);
  const [apiGenres, setApiGenres] = React.useState<Genre[]>([]);

  // API state for movies
  const [movies, setMovies] = React.useState<Media[]>([]);
  const [movieOffset, setMovieOffset] = React.useState<number>(0);
  const [totalMovies, setTotalMovies] = React.useState<number>(0);

  // Compare mode states
  const [selectedForCompare, setSelectedForCompare] = React.useState<Media[]>([]);
  const [compareType, setCompareType] = React.useState<string | null>(null);

  // Fetch genres from API on mount
  React.useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tvApi.getGenres();
        const genres: Genre[] = response.data.data.map((g) => ({
          genre_id: g.genre_id,
          name: g.name
        }));
        setApiGenres(genres);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, []);

  // Fetch TV shows from API when currentPage or selectedGenres changes
  React.useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch shows for current page (API limit is 100 per page)
        // Use filter endpoint if genres are selected
        const genresParam = selectedGenres.length > 0 ? selectedGenres.join(',') : undefined;
        const response = genresParam ? await tvApi.getFilteredShows(currentPage, 100, genresParam) : await tvApi.getShows(currentPage, 100);

        // Convert API TV shows to Media type format
        const convertedShows: Media[] = response.data.data.map((show) => ({
          type: 'tv' as const,
          show_id: show.show_id,
          name: show.name,
          original_name: show.original_name,
          first_air_date: show.first_air_date,
          last_air_date: show.first_air_date, // API doesn't return this in list view
          seasons: show.seasons,
          episodes: show.episodes,
          status: show.status,
          overview: '', // Not available in list endpoint
          popularity: show.popularity,
          tmdb_rating: show.tmdb_rating,
          vote_count: 0, // Not available in list endpoint
          creators: [], // Not available in list endpoint
          poster_url: show.poster_url,
          backdrop_url: '', // Not available in list endpoint
          genres: [], // We'll fetch this separately or leave empty for list view
          network: {
            network_id: 0,
            name: '',
            logo: '',
            country: ''
          },
          companies: [],
          actors: []
        }));

        setTvShows(convertedShows);

        // Calculate total pages
        const total = response.data.count;
        const pages = Math.ceil(total / response.data.limit);
        setTotalPages(pages);
        setTotalTVShows(total);
      } catch (err: unknown) {
        console.error('Error fetching TV shows:', err);
        setError('Failed to load TV shows. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [currentPage, selectedGenres]);

  // Fetch movies from API when movieOffset changes
  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch movies for current offset (100 per page)
        const response = await movieApi.getMovies(100, movieOffset);

        // Convert API movies to Media type format
        const convertedMovies: Media[] = response.data.data.data.map((movie) => ({
          type: 'movie' as const,
          movie_id: movie.movie_id,
          title: movie.title,
          original_title: movie.original_title,
          release_year: movie.release_year,
          release_date: `${movie.release_year}-01-01T00:00:00.000Z`, // Approximate date
          runtime_minutes: movie.runtime_minutes,
          rating: (movie.mpa_rating || movie.rating || 'Not Rated') as string,
          box_office: movie.box_office,
          director_id: movie.director_id,
          director_name: movie.director_name,
          country_id: movie.country_id,
          overview: movie.overview,
          popularity: 0, // Not available in list endpoint
          tmdb_rating: 0, // Not available in list endpoint
          vote_count: 0, // Not available in list endpoint
          poster_url: movie.poster_url ? `https://image.tmdb.org/t/p/w500${movie.poster_url}` : '',
          backdrop_url: movie.backdrop_url ? `https://image.tmdb.org/t/p/w500${movie.backdrop_url}` : '',
          genres: movie.genres ? movie.genres.split(';').map((g, i) => ({ genre_id: i, name: g.trim() })) : [],
          companies: [],
          actors: []
        }));

        setMovies(convertedMovies);
        setTotalMovies(response.data.data.pagination.totalCount);

        // Calculate total pages for movies
        const moviePages = Math.ceil(response.data.data.pagination.totalCount / 100);
        // Update totalPages to be the max of TV and movie pages
        setTotalPages((prevTotalPages) => Math.max(prevTotalPages, moviePages));
      } catch (err: unknown) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [movieOffset]);

  // Combine TV shows and movies from APIs
  const allMedia = React.useMemo(() => {
    return [...tvShows, ...movies];
  }, [tvShows, movies]);

  const handleTypeFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) {
      setTypeFilter(newFilter);
      // Reset to page 1 and offset 0 when changing type filter
      setCurrentPage(1);
      setMovieOffset(0);
    }
  };

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) => (prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]));
    // Reset to page 1 when changing genre filter
    setCurrentPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    // Handle pagination based on current filter
    if (typeFilter === 'tv' || typeFilter === 'all') {
      setCurrentPage(page);
    }
    if (typeFilter === 'movie' || typeFilter === 'all') {
      // Convert page to offset (page 1 = offset 0, page 2 = offset 100, etc.)
      setMovieOffset((page - 1) * 100);
    }
    // Scroll to top smoothly when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle a media card's compare selection
  const toggleCompare = (media: Media) => {
    const isSelected = selectedForCompare.some((m) => {
      if (media.type === 'tv' && m.type === 'tv') {
        return m.show_id === media.show_id;
      }
      if (media.type === 'movie' && m.type === 'movie') {
        return m.movie_id === media.movie_id;
      }
      return false;
    });

    if (isSelected) {
      // Deselect
      const newSelected = selectedForCompare.filter((m) => {
        if (media.type === 'tv' && m.type === 'tv') {
          return m.show_id !== media.show_id;
        }
        if (media.type === 'movie' && m.type === 'movie') {
          return m.movie_id !== media.movie_id;
        }
        return true;
      });
      setSelectedForCompare(newSelected);
      if (newSelected.length === 0) {
        setCompareType(null);
      }
    } else {
      // Select only if under limit and type matches or not set
      if (selectedForCompare.length < 2 && (compareType === null || compareType === media.type)) {
        setSelectedForCompare([...selectedForCompare, media]);
        if (!compareType) {
          setCompareType(media.type);
        }
      }
    }
  };

  // Check if a media is selected for compare
  const isSelectedForCompare = (media: Media): boolean => {
    return selectedForCompare.some((m) => {
      if (media.type === 'tv' && m.type === 'tv') {
        return m.show_id === media.show_id;
      }
      if (media.type === 'movie' && m.type === 'movie') {
        return m.movie_id === media.movie_id;
      }
      return false;
    });
  };

  // Confirm comparison and navigate
  // TODO: need the correct route for a different page where we do the comparison
  const confirmCompare = () => {
    // For real app, likely pass selectedForCompare info (via context, state, query, etc.)
    router.push('/compare');
  };

  // Get all unique genres from TV API
  const allGenres = React.useMemo(() => {
    return apiGenres.sort((a, b) => a.name.localeCompare(b.name));
  }, [apiGenres]);

  const filteredMedia = React.useMemo(() => {
    let result = allMedia;

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((media) => media.type === typeFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((media) => {
        const title = media.type === 'tv' ? media.name : media.title;
        return title.toLowerCase().includes(query);
      });
    }

    // Genre filter - TV shows are filtered server-side via API
    // Movies don't have genre data in list endpoint, so skip genre filtering for movies
    if (selectedGenres.length > 0 && typeFilter === 'all') {
      // When showing "all", only keep TV shows (already filtered) and skip movies
      result = result.filter((media) => media.type === 'tv');
    }

    return result;
  }, [allMedia, typeFilter, searchQuery, selectedGenres]);

  const handleMediaClick = (media: Media) => {
    if (selectedForCompare.length > 0) return; // disable navigation during compare mode
    const id = media.type === 'tv' ? media.show_id : media.movie_id;
    router.push(`/${media.type}/${id}`);
  };

  const getTitle = (media: Media) => (media.type === 'tv' ? media.name : media.title);
  const getYear = (media: Media) =>
    media.type === 'tv'
      ? media.first_air_date
        ? new Date(media.first_air_date).getFullYear()
        : null
      : media.release_date
        ? new Date(media.release_date).getFullYear()
        : null;
  const getMetadata = (media: Media) =>
    media.type === 'tv'
      ? `${media.seasons} Season${media.seasons > 1 ? 's' : ''} • ${media.episodes} Episodes`
      : `${media.runtime_minutes} mins`;

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Media Catalog
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Browse our collection of movies and TV shows
        </Typography>

        {/* Search Bar */}
        <Box sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Type Filter Buttons */}
        <ToggleButtonGroup
          value={typeFilter}
          exclusive
          onChange={handleTypeFilterChange}
          aria-label="media type filter"
          color="primary"
          sx={{ mb: 3 }}
        >
          <ToggleButton value="all" aria-label="all media">
            All ({totalTVShows + totalMovies})
          </ToggleButton>
          <ToggleButton value="movie" aria-label="movies">
            Movies ({totalMovies})
          </ToggleButton>
          <ToggleButton value="tv" aria-label="tv shows">
            TV Shows ({totalTVShows})
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Genre Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Filter by Genre
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
            {allGenres.map((genre) => (
              <Chip
                key={genre.genre_id}
                label={genre.name}
                onClick={() => handleGenreToggle(genre.genre_id)}
                color={selectedGenres.includes(genre.genre_id) ? 'primary' : 'default'}
                variant={selectedGenres.includes(genre.genre_id) ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredMedia.length} of {allMedia.length} titles
        </Typography>
      </Box>

      {/* Pagination - Top */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : /* Media Grid */
      filteredMedia.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No media found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your filters or search query
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMedia.map((media) => {
            const greyOut = (() => {
              if (compareType === null) return false;
              if (media.type !== compareType) return true;
              if (selectedForCompare.length === 2 && !isSelectedForCompare(media)) return true;
              return false;
            })();
            const disableInteraction = greyOut;
            const selected = isSelectedForCompare(media);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={media.type === 'tv' ? media.show_id : media.movie_id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: disableInteraction ? 'default' : 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s, filter 0.3s, opacity 0.3s',
                    outline: 'none',
                    filter: greyOut ? 'grayscale(80%)' : 'none',
                    opacity: greyOut ? 0.5 : 1,
                    pointerEvents: disableInteraction ? 'none' : 'auto',
                    border: selected ? '4px solid' : 'none',
                    borderColor: selected ? 'primary.main' : 'transparent',
                    '&:hover': disableInteraction
                      ? {}
                      : {
                          transform: 'translateY(-8px)',
                          boxShadow: 6
                        },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: '2px'
                    }
                  }}
                  onClick={() => handleMediaClick(media)}
                  tabIndex={0}
                  aria-selected={selected}
                >
                  {/* Poster Image */}
                  <CardMedia
                    component="img"
                    height="400"
                    image={media.poster_url}
                    alt={getTitle(media)}
                    sx={{
                      objectFit: 'cover',
                      transition: 'filter 0.3s, opacity 0.3s',
                      filter: greyOut ? 'grayscale(80%)' : 'none',
                      opacity: greyOut ? 0.5 : 1
                    }}
                  />

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        icon={media.type === 'movie' ? <MovieIcon /> : <TvIcon />}
                        label={media.type === 'movie' ? 'Movie' : 'TV Show'}
                        size="small"
                        color={media.type === 'movie' ? 'primary' : 'secondary'}
                      />
                    </Box>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.2, mb: 1 }}>
                      {getTitle(media)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {getYear(media)} • {getMetadata(media)}
                    </Typography>

                    {/* Show rating stars for TV shows only */}
                    {media.type === 'tv' && (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Rating value={media.tmdb_rating / 2} readOnly precision={0.1} size="small" icon={<StarIcon fontSize="inherit" />} />
                        <Typography variant="body2" color="text.secondary">
                          {media.tmdb_rating.toFixed(1)}
                        </Typography>
                      </Stack>
                    )}

                    {/* Show MPA rating and genres for movies */}
                    {media.type === 'movie' && (
                      <Box sx={{ mb: 1 }}>
                        {media.rating && (
                          <Chip label={media.rating} size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />
                        )}
                        {media.genres.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {media.genres.slice(0, 3).map((genre) => (
                              <Chip key={genre.genre_id} label={genre.name} size="small" variant="outlined" />
                            ))}
                          </Box>
                        )}
                      </Box>
                    )}
                  </CardContent>

                  <CardActions
                    sx={{
                      px: 2,
                      py: 2,
                      pt: 1.5,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1
                    }}
                  >
                    <IconButton
                      size="large"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Your delete handler here
                      }}
                      sx={{
                        '& svg': {
                          fontSize: 28
                        }
                      }}
                      aria-label="delete media"
                    >
                      <DeleteIcon />
                    </IconButton>

                    <Button
                      variant={selected ? 'contained' : 'outlined'}
                      size="medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(media);
                      }}
                      aria-pressed={selected}
                      startIcon={<CompareArrowsIcon />}
                    >
                      Compare
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Pagination - Show for all tabs */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      )}

      {/* Pagination info */}
      {!loading && totalPages > 1 && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {typeFilter === 'all'
              ? `Showing page ${currentPage} of ${totalPages} (${totalTVShows} TV shows + ${totalMovies} movies)`
              : typeFilter === 'tv'
                ? `Showing page ${currentPage} of ${totalPages} (${totalTVShows} total TV shows)`
                : `Showing page ${currentPage} of ${totalPages} (${totalMovies} total movies)`}
          </Typography>
        </Box>
      )}

      {/* Confirm Compare FAB */}
      <Zoom in={selectedForCompare.length === 2}>
        <Fab
          color="primary"
          aria-label="confirm compare"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: (theme) => theme.zIndex.tooltip + 1,
            boxShadow: 6
          }}
          onClick={confirmCompare}
        >
          <CompareArrowsIcon />
        </Fab>
      </Zoom>
    </Container>
  );
}
