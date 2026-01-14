import { useState } from "react";
import { Star, Film } from "lucide-react";
import { Movie } from "@/hooks/useMovies";
import BookingDialog from "./BookingDialog";

interface MovieCardProps {
  movie: Movie;
  featured?: boolean;
}

const FALLBACK_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop";

const MovieCard = ({ movie, featured = false }: MovieCardProps) => {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <div className={`group relative cursor-pointer ${featured ? "w-full" : ""}`}>
        {/* Poster Container */}
        <div className="relative overflow-hidden rounded-lg bg-muted aspect-[2/3]">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = FALLBACK_POSTER;
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs font-medium">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white">{movie.rating}/10</span>
          </div>

          {/* Hover Content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button 
              onClick={() => setBookingOpen(true)}
              className="w-full py-2 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
            >
              Book Tickets
            </button>
          </div>
        </div>

        {/* Movie Info */}
        <div className="mt-3 space-y-1">
          <h3 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{movie.genres.join("/")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-muted rounded text-muted-foreground">
              {movie.language}
            </span>
            <span className="text-muted-foreground">{movie.votes} votes</span>
          </div>
        </div>
      </div>

      <BookingDialog 
        movie={movie} 
        open={bookingOpen} 
        onOpenChange={setBookingOpen} 
      />
    </>
  );
};

export default MovieCard;
