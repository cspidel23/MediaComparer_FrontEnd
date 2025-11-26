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
  Pagination,
  Autocomplete
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
  const [selectedYear, setSelectedYear] = React.useState<string>('');

  // TV-specific filters
  const [tvMinRating, setTvMinRating] = React.useState<number | ''>('');
  const [tvNetwork, setTvNetwork] = React.useState<string>('');
  const [tvStatus, setTvStatus] = React.useState<string>('');

  // Movie-specific filters
  const [movieRating, setMovieRating] = React.useState<string>('');

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

  // Fetch TV shows from API when currentPage, selectedGenres, selectedYear, or searchQuery changes
  React.useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch shows for current page (API limit is 100 per page)
        // Use filter endpoint if search query, genres, year, or other filters are selected
        const nameParam = searchQuery.trim() || undefined;
        const genresParam =
          selectedGenres.length > 0
            ? selectedGenres
              .map((id) => apiGenres.find((g) => g.genre_id === id)?.name)
              .filter(Boolean)
              .join(',')
            : undefined;
        const startDate = selectedYear ? `${selectedYear}-01-01` : undefined;
        const endDate = selectedYear ? `${selectedYear}-12-31` : undefined;
        const minRating = tvMinRating !== '' ? tvMinRating : undefined;
        const network = tvNetwork.trim() || undefined;
        const status = tvStatus.trim() || undefined;

        const response =
          nameParam || genresParam || startDate || minRating !== undefined || network || status
            ? await tvApi.getFilteredShows(
              currentPage,
              100,
              nameParam,
              genresParam,
              startDate,
              endDate,
              minRating,
              undefined,
              network,
              status
            )
            : await tvApi.getShows(currentPage, 100);

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
  }, [currentPage, selectedGenres, selectedYear, apiGenres, searchQuery, tvMinRating, tvNetwork, tvStatus]);

  // Fetch movies from API when movieOffset, selectedGenres, selectedYear, or searchQuery changes
  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use search endpoint if search query is provided
        let response;
        if (searchQuery.trim()) {
          response = await movieApi.searchMovies(searchQuery.trim(), 100, movieOffset);
        } else {
          // Fetch movies for current offset (100 per page)
          // Movie API supports single genre filter, so use first selected genre
          const genreParam =
            selectedGenres.length > 0 && apiGenres.length > 0 ? apiGenres.find((g) => g.genre_id === selectedGenres[0])?.name : undefined;
          const yearNum = selectedYear ? parseInt(selectedYear) : undefined;
          response = await movieApi.getMovies(100, movieOffset, genreParam, yearNum, yearNum);
        }

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
  }, [movieOffset, selectedGenres, selectedYear, apiGenres, searchQuery, movieRating]);

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
    if (selectedForCompare.length !== 2) return;

    const [first, second] = selectedForCompare;

    if (first.type !== second.type) {
      alert('Please select two items of the same type to compare');
      return;
    }

    const id = first.type === 'tv' ? first.show_id : first.movie_id;
    const id2 = second.type === 'tv' ? second.show_id : second.movie_id;
    router.push(`/compare-${first.type}s/${id}/${id2}`);
  };

  // Get all unique genres from TV API
  const allGenres = React.useMemo(() => {
    return apiGenres.sort((a, b) => a.name.localeCompare(b.name));
  }, [apiGenres]);

  // Generate year options from current year down to 1900
  const yearOptions = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  }, []);

  // MPA rating options for movies
  const mpaRatingOptions = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'Not Rated'];

  // Rating options for TV shows (0 to 10 in 0.5 increments) - for minimum rating
  const tvRatingOptions = React.useMemo(() => {
    const ratings: number[] = [];
    for (let i = 0; i <= 10; i += 0.5) {
      ratings.push(Number(i.toFixed(1)));
    }
    return ratings;
  }, []);

  // Common TV show networks
  const tvNetworkOptions = [
    'ABC',
    'CBS',
    'NBC',
    'FOX',
    'The CW',
    'HBO',
    'Netflix',
    'Amazon',
    'Hulu',
    'Disney+',
    'Apple TV+',
    'Showtime',
    'AMC',
    'FX',
    'USA Network',
    'TNT',
    'Syfy'
  ];

  // TV show status options
  const tvStatusOptions = ['Returning Series', 'Ended', 'Canceled', 'In Production', 'Planned'];

  const filteredMedia = React.useMemo(() => {
    let result = allMedia;

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((media) => media.type === typeFilter);
    }

    // Search filtering is now handled server-side for both TV shows and movies
    // Genre and year filtering is also handled server-side for both TV shows and movies

    // Client-side movie rating filter (temporary until backend supports it)
    if (movieRating && typeFilter !== 'tv') {
      result = result.filter((media) => {
        if (media.type === 'movie') {
          return media.rating?.toLowerCase() === movieRating.toLowerCase();
        }
        return true;
      });
    }

    return result;
  }, [allMedia, typeFilter, movieRating]);

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
          Media Catalog
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
          Browse our collection of movies and TV shows
        </Typography>

        {/* Search Bar */}
        <Box sx={{ mb: 4, maxWidth: 650, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Reset pagination when searching
              setCurrentPage(1);
              setMovieOffset(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  boxShadow: 2
                },
                '&.Mui-focused': {
                  backgroundColor: 'background.paper',
                  boxShadow: 4,
                  '& fieldset': {
                    borderWidth: 2
                  }
                }
              }
            }}
          />
        </Box>

        {/* Type Filter Buttons */}
        <Box sx={{ mb: 4 }}>
          <ToggleButtonGroup
            value={typeFilter}
            exclusive
            onChange={handleTypeFilterChange}
            aria-label="media type filter"
            color="primary"
            sx={{
              gap: 1,
              '& .MuiToggleButton-root': {
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.2s',
                border: '2px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    borderColor: 'primary.dark'
                  }
                }
              }
            }}
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
        </Box>

        {/* Genre Filters */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
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
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Year Filter */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
            Release Year
          </Typography>
          <Autocomplete
            size="small"
            options={yearOptions}
            value={selectedYear ? parseInt(selectedYear) : null}
            onChange={(_event, newValue) => {
              setSelectedYear(newValue ? newValue.toString() : '');
              setCurrentPage(1);
              setMovieOffset(0);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="All Years"
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
                      boxShadow: 3
                    }
                  }
                }}
              />
            )}
            getOptionLabel={(option) => option.toString()}
            isOptionEqualToValue={(option, value) => option === value}
            sx={{
              width: 280,
              '& .MuiAutocomplete-popupIndicator': {
                transition: 'transform 0.2s',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              },
              '& .MuiAutocomplete-clearIndicator': {
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }
            }}
            clearOnEscape
            disableClearable={false}
            componentsProps={{
              paper: {
                sx: {
                  boxShadow: 6,
                  mt: 1,
                  borderRadius: 2,
                  '& .MuiAutocomplete-listbox': {
                    maxHeight: '300px',
                    '& .MuiAutocomplete-option': {
                      py: 1.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      '&[aria-selected="true"]': {
                        backgroundColor: 'action.selected',
                        fontWeight: 600
                      }
                    }
                  }
                }
              }
            }}
          />
        </Box>

        {/* TV-Specific Filters */}
        {typeFilter === 'tv' && (
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
              TV Show Filters
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap justifyContent="center" alignItems="center">
              {/* Minimum Rating */}
              <Autocomplete
                size="small"
                options={tvRatingOptions}
                value={tvMinRating !== '' ? tvMinRating : null}
                onChange={(_event, newValue) => {
                  setTvMinRating(newValue !== null ? newValue : '');
                  setCurrentPage(1);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Minimum Rating"
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
                          boxShadow: 3
                        }
                      }
                    }}
                  />
                )}
                getOptionLabel={(option) => `${option.toString()}+`}
                isOptionEqualToValue={(option, value) => option === value}
                sx={{ width: 180 }}
                clearOnEscape
                disableClearable={false}
                componentsProps={{
                  paper: {
                    sx: {
                      boxShadow: 6,
                      mt: 1,
                      borderRadius: 2,
                      '& .MuiAutocomplete-listbox': {
                        maxHeight: '300px',
                        '& .MuiAutocomplete-option': {
                          py: 1.5,
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: 'action.selected',
                            fontWeight: 600
                          }
                        }
                      }
                    }
                  }
                }}
              />
              {/* Network */}
              <Autocomplete
                size="small"
                options={tvNetworkOptions}
                value={tvNetwork || null}
                onChange={(_event, newValue) => {
                  setTvNetwork(newValue || '');
                  setCurrentPage(1);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Network"
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
                          boxShadow: 3
                        }
                      }
                    }}
                  />
                )}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                sx={{ width: 200 }}
                clearOnEscape
                disableClearable={false}
                componentsProps={{
                  paper: {
                    sx: {
                      boxShadow: 6,
                      mt: 1,
                      borderRadius: 2,
                      '& .MuiAutocomplete-listbox': {
                        maxHeight: '300px',
                        '& .MuiAutocomplete-option': {
                          py: 1.5,
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: 'action.selected',
                            fontWeight: 600
                          }
                        }
                      }
                    }
                  }
                }}
              />
              {/* Status */}
              <Autocomplete
                size="small"
                options={tvStatusOptions}
                value={tvStatus || null}
                onChange={(_event, newValue) => {
                  setTvStatus(newValue || '');
                  setCurrentPage(1);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Status"
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
                          boxShadow: 3
                        }
                      }
                    }}
                  />
                )}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                sx={{ width: 200 }}
                clearOnEscape
                disableClearable={false}
                componentsProps={{
                  paper: {
                    sx: {
                      boxShadow: 6,
                      mt: 1,
                      borderRadius: 2,
                      '& .MuiAutocomplete-listbox': {
                        maxHeight: '300px',
                        '& .MuiAutocomplete-option': {
                          py: 1.5,
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: 'action.selected',
                            fontWeight: 600
                          }
                        }
                      }
                    }
                  }
                }}
              />
              {/* Clear TV Filters */}
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setTvMinRating('');
                  setTvNetwork('');
                  setTvStatus('');
                  setCurrentPage(1);
                }}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Clear TV Filters
              </Button>
            </Stack>
          </Box>
        )}

        {/* Movie-Specific Filters */}
        {typeFilter === 'movie' && (
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
              Movie Filters
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap justifyContent="center" alignItems="center">
              {/* MPA Rating */}
              <Autocomplete
                size="small"
                options={mpaRatingOptions}
                value={movieRating || null}
                onChange={(_event, newValue) => {
                  setMovieRating(newValue || '');
                  setMovieOffset(0);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="All Ratings"
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
                          boxShadow: 3
                        }
                      }
                    }}
                  />
                )}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                sx={{ width: 280 }}
                clearOnEscape
                disableClearable={false}
                componentsProps={{
                  paper: {
                    sx: {
                      boxShadow: 6,
                      mt: 1,
                      borderRadius: 2,
                      '& .MuiAutocomplete-listbox': {
                        maxHeight: '300px',
                        '& .MuiAutocomplete-option': {
                          py: 1.5,
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: 'action.selected',
                            fontWeight: 600
                          }
                        }
                      }
                    }
                  }
                }}
              />
              {/* Clear Movie Filters */}
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setMovieRating('');
                  setMovieOffset(0);
                }}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Clear Movie Filters
              </Button>
            </Stack>
          </Box>
        )}
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
                          <Rating
                            value={media.tmdb_rating / 2}
                            readOnly
                            precision={0.1}
                            size="small"
                            icon={<StarIcon fontSize="inherit" />}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {media.tmdb_rating.toFixed(1)}
                          </Typography>
                        </Stack>
                      )}

                      {/* Show MPA rating and genres for movies */}
                      {media.type === 'movie' && (
                        <Box sx={{ mb: 1 }}>
                          {media.rating && <Chip label={media.rating} size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />}
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