import Link from 'next/link';
import { MOCK_MEDIA } from '../mock/media';

export default function CatalogPage() {
  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Catalog (Mock)
      </h1>

      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16
        }}
      >
        {MOCK_MEDIA.map((item) => (
          <li
            key={item.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 12
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {item.posterUrl && <img src={item.posterUrl} alt={item.title} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />}

            <h3 style={{ margin: '8px 0' }}>{item.title}</h3>
            <p style={{ margin: 0 }}>
              {item.type.toUpperCase()} {item.year ? `• ${item.year}` : ''}
            </p>

            <Link
              href={`/${item.type}/${item.id}`}
              style={{ display: "inline-block", marginTop: 8, color: "#2563eb" }}
            >
              View details →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
