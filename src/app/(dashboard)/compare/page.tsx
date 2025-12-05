// compare\page.tsx
import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function ComparePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card elevation={3} sx={{ opacity: 0.35 }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Box sx={{ mb: 3 }}>
            <ConstructionIcon sx={{ fontSize: 80, color: '#faad14' }} />
          </Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Under Construction
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            The Media Comparison feature is coming soon!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
