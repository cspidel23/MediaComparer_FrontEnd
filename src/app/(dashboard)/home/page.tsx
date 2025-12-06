import Link from 'next/link';
import { Box, Container, Typography, Button, Card, CardContent, Stack } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          Welcome to Media Comparer
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
          Discover and compare your favorite movies and TV shows
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center" sx={{ mt: 6 }}>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <MovieIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Browse Catalog
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Explore our collection of movies and TV shows
              </Typography>
              <Link href="/catalog" passHref legacyBehavior>
                <Button variant="contained" fullWidth>
                  Browse Now
                </Button>
              </Link>
            </CardContent>
          </Card>


          <Card sx={{ maxWidth: 300 }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <CompareArrowsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Compare
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Compare movies and TV shows side by side
              </Typography>
              <Link href="/compare" passHref legacyBehavior>
                <Button variant="outlined" fullWidth>
                  Coming Soon
                </Button>
              </Link>
            </CardContent>
          </Card>



        </Stack>
      </Box>
    </Container>
  );
}
