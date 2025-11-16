import { useRouter } from 'next/navigation';

import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Chip, Box } from '@mui/material';

// project import
import { Media } from 'app/mock/media';

export function MediaListItem({ media }: { media: Media }) {
  const router = useRouter();

  function onItemClick(item: Media) {
    const id = item.type === 'tv' ? item.show_id : item.movie_id;
    router.push(`/${item.type}/${id}`);
  }

  const getMediaIcon = () => {
    return media.type === 'movie' ? <MovieIcon /> : <TvIcon />;
  };

  const getTitle = () => {
    return media.type === 'tv' ? media.name : media.title;
  };

  const getSecondaryText = () => {
    const parts = [];

    if (media.type === 'tv') {
      const year = media.first_air_date ? new Date(media.first_air_date).getFullYear() : null;
      if (year) parts.push(year.toString());
      if (media.seasons) parts.push(`${media.seasons} season${media.seasons > 1 ? 's' : ''}`);
      if (media.episodes) parts.push(`${media.episodes} episodes`);
    } else {
      const year = media.release_date ? new Date(media.release_date).getFullYear() : null;
      if (year) parts.push(year.toString());
      if (media.runtime_minutes) parts.push(`${media.runtime_minutes} mins`);
    }

    // Add rating
    if (media.tmdb_rating) {
      parts.push(`⭐ ${media.tmdb_rating.toFixed(1)}`);
    }

    return parts.join(' • ');
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onItemClick(media)}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: media.type === 'movie' ? 'primary.main' : 'secondary.main' }}>{getMediaIcon()}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getTitle()}
              <Chip label={media.type.toUpperCase()} size="small" color={media.type === 'movie' ? 'primary' : 'secondary'} />
            </Box>
          }
          secondary={getSecondaryText()}
          slotProps={{
            secondary: { color: 'gray' }
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export function NoMedia() {
  return (
    <ListItem>
      <ListItemAvatar>
        <VideoLibraryIcon />
      </ListItemAvatar>
      <ListItemText primary="No Media Available" />
    </ListItem>
  );
}
