import { notFound } from 'next/navigation';
import { getById, type Media } from '../../mock/media';

export default async function TvPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 👈 unwrap the Promise
  const media: Media | null = getById(id);
  if (!media || media.type !== 'tv') notFound();

  return (
    <main style={{ padding: 16 }}>
      {media.backdropUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.backdropUrl} alt={`${media.title} backdrop`} style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
      )}

      <h1 style={{ marginBottom: 8, fontSize: 28 }}>{media.title}</h1>

      <p style={{ margin: '4px 0' }}>
        <b>Seasons:</b> {media.seasons ?? '—'}
      </p>

      {media.genres && (
        <p style={{ margin: '4px 0' }}>
          <b>Genres:</b> {media.genres.join(', ')}
        </p>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      {media.posterUrl && <img src={media.posterUrl} alt={media.title} style={{ width: 300, borderRadius: 8, margin: '12px 0' }} />}

      <p style={{ maxWidth: 720 }}>{media.overview}</p>
      <p>
        <a href="/catalog" style={{ color: '#2563eb' }}>
          ← Back to catalog
        </a>
      </p>
    </main>
  );
}
