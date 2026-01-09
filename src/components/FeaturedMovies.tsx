import { movies } from "@/data/movies";
import MovieCard from "./MovieCard";

const FeaturedMovies = () => {
  const featuredMovies = movies.filter((movie) => movie.isFeatured).slice(0, 6);

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
