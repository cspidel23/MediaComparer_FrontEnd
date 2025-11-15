import { MOCK_MEDIA } from '../../mock/media';

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-100 via-indigo-50 to-white">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-[1240px] mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Media Library
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Discover movies and TV shows. Browse through our collection of entertainment content.
          </p>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-4 text-center">
            Featured Content
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center">
            Explore our curated selection
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_MEDIA.map((media) => (
              <div
                key={media.id}
                className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                {/* Backdrop Image */}
                {media.backdropUrl && (
                  <div className="relative h-64 w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media.backdropUrl}
                      alt={media.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                      <span className="inline-block bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-md mb-2">
                        {media.type === 'movie' ? 'Movie' : 'TV Series'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex gap-4">
                    {/* Poster */}
                    {media.posterUrl && (
                      <div className="flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={media.posterUrl}
                          alt={media.title}
                          className="w-24 h-36 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-3xl font-extrabold text-gray-800 mb-2">
                        {media.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {media.year && (
                          <span className="text-gray-600 text-sm">{media.year}</span>
                        )}
                        {media.runtimeMins && (
                          <span className="text-gray-600 text-sm">
                            • {media.runtimeMins} mins
                          </span>
                        )}
                        {media.seasons && (
                          <span className="text-gray-600 text-sm">
                            • {media.seasons} Season{media.seasons > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {/* Genres */}
                      {media.genres && media.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {media.genres.map((genre) => (
                            <span
                              key={genre}
                              className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Overview */}
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {media.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-linear-to-br from-indigo-50 to-white">
        <div className="max-w-[1240px] mx-auto text-center">
          <h2 className="text-2xl md:text-5xl font-bold text-gray-800 mb-6">
            Ready for API Integration
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            This application is built with Next.js and uses mock data. You can easily integrate
            with real APIs like TMDB, OMDB, or any other media database API.
          </p>
        </div>
      </section>
    </main>
  );
}
