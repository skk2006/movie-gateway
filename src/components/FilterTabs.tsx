const languages = ["All", "Hindi", "English", "Telugu", "Tamil", "Kannada"];
const genres = ["Action", "Comedy", "Drama", "Thriller", "Sci-Fi", "Adventure", "Romance"];

interface FilterTabsProps {
  selectedLanguage: string;
  selectedGenre: string;
  onLanguageChange: (language: string) => void;
  onGenreChange: (genre: string) => void;
}

const FilterTabs = ({
  selectedLanguage,
  selectedGenre,
  onLanguageChange,
  onGenreChange,
}: FilterTabsProps) => {
  return (
    <div className="space-y-4">
      {/* Language Filter */}
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <button
            key={language}
            onClick={() => onLanguageChange(language)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedLanguage === language
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {language}
          </button>
        ))}
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2">
        {["All", ...genres].map((genre) => (
          <button
            key={genre}
            onClick={() => onGenreChange(genre)}
            className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
              selectedGenre === genre
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;
