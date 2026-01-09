import { useFeaturedMovies } from "@/hooks/useMovies";
import MovieCard from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedMovies = () => {
  const { data: featuredMovies, isLoading, error } = useFeaturedMovies();

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 bg-muted" />
            <Skeleton className="h-4 w-64 mt-2 bg-muted" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] rounded-lg bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !featuredMovies?.length) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured This Week</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Top picks and trending movies
            </p>
          </div>
          <a
            href="#"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            See All →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} featured />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMovies;
