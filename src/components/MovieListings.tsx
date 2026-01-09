import { useState } from "react";
import { useMovies } from "@/hooks/useMovies";
import MovieCard from "./MovieCard";
import FilterTabs from "./FilterTabs";
import { Skeleton } from "@/components/ui/skeleton";

const MovieListings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  
  const { data: movies, isLoading, error } = useMovies(selectedLanguage, selectedGenre);

  return (
    <section className="py-8 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Now Showing</h2>
          <FilterTabs
            selectedLanguage={selectedLanguage}
            selectedGenre={selectedGenre}
            onLanguageChange={setSelectedLanguage}
            onGenreChange={setSelectedGenre}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] rounded-lg bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground">
              Failed to load movies. Please try again.
            </p>
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No movies found for the selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedLanguage("All");
                setSelectedGenre("All");
              }}
              className="mt-4 text-primary hover:text-primary/80 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieListings;
