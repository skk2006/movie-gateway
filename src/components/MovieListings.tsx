import { useState } from "react";
import { movies } from "@/data/movies";
import MovieCard from "./MovieCard";
import FilterTabs from "./FilterTabs";

const MovieListings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filteredMovies = movies.filter((movie) => {
    const languageMatch =
      selectedLanguage === "All" || movie.language === selectedLanguage;
    const genreMatch =
      selectedGenre === "All" || movie.genres.includes(selectedGenre);
    return languageMatch && genreMatch;
  });

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

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredMovies.map((movie) => (
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
