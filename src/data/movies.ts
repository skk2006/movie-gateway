export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
  releaseDate: string;
  isFeatured?: boolean;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    poster: "https://image.tmdb.org/t/p/w500/bGLvnGbOXnUg1wT3zLxqNbryZhI.jpg",
    rating: 8.5,
    votes: "125K",
    genres: ["Action", "Drama"],
    language: "Telugu",
    releaseDate: "Dec 6, 2024",
    isFeatured: true
  },
  {
    id: 2,
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    rating: 8.8,
    votes: "450K",
    genres: ["Sci-Fi", "Adventure"],
    language: "English",
    releaseDate: "Mar 1, 2024",
    isFeatured: true
  },
  {
    id: 3,
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rating: 8.9,
    votes: "890K",
    genres: ["Drama", "Biography"],
    language: "English",
    releaseDate: "Jul 21, 2023",
    isFeatured: true
  },
  {
    id: 4,
    title: "Animal",
    poster: "https://image.tmdb.org/t/p/w500/hr9rjR0JEQDNS4I5NMiLfD6ZuLz.jpg",
    rating: 7.8,
    votes: "320K",
    genres: ["Action", "Drama"],
    language: "Hindi",
    releaseDate: "Dec 1, 2023",
    isFeatured: true
  },
  {
    id: 5,
    title: "The Batman",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fber1kGDtkB0QRjL.jpg",
    rating: 8.1,
    votes: "650K",
    genres: ["Action", "Crime"],
    language: "English",
    releaseDate: "Mar 4, 2022",
    isFeatured: true
  },
  {
    id: 6,
    title: "Jawan",
    poster: "https://image.tmdb.org/t/p/w500/jFzybPW0mxXCHZdaQXLd2r6PxCa.jpg",
    rating: 7.9,
    votes: "410K",
    genres: ["Action", "Thriller"],
    language: "Hindi",
    releaseDate: "Sep 7, 2023",
    isFeatured: true
  },
  {
    id: 7,
    title: "Avatar: The Way of Water",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    rating: 8.4,
    votes: "780K",
    genres: ["Sci-Fi", "Adventure"],
    language: "English",
    releaseDate: "Dec 16, 2022"
  },
  {
    id: 8,
    title: "RRR",
    poster: "https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg",
    rating: 8.6,
    votes: "520K",
    genres: ["Action", "Drama"],
    language: "Telugu",
    releaseDate: "Mar 25, 2022"
  },
  {
    id: 9,
    title: "Pathaan",
    poster: "https://image.tmdb.org/t/p/w500/rCFriEBPzBoHrNhNzJaDMmZJmpe.jpg",
    rating: 7.5,
    votes: "380K",
    genres: ["Action", "Thriller"],
    language: "Hindi",
    releaseDate: "Jan 25, 2023"
  },
  {
    id: 10,
    title: "Top Gun: Maverick",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    rating: 8.7,
    votes: "720K",
    genres: ["Action", "Drama"],
    language: "English",
    releaseDate: "May 27, 2022"
  },
  {
    id: 11,
    title: "KGF: Chapter 2",
    poster: "https://image.tmdb.org/t/p/w500/xUH3fEJyk9avGxnCTfpFgzEixoA.jpg",
    rating: 8.3,
    votes: "490K",
    genres: ["Action", "Drama"],
    language: "Kannada",
    releaseDate: "Apr 14, 2022"
  },
  {
    id: 12,
    title: "Spider-Man: No Way Home",
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    rating: 8.5,
    votes: "950K",
    genres: ["Action", "Adventure"],
    language: "English",
    releaseDate: "Dec 17, 2021"
  },
  {
    id: 13,
    title: "Salaar",
    poster: "https://image.tmdb.org/t/p/w500/qGsnAzKyx6oziTBxLmxpQfKdQl.jpg",
    rating: 7.6,
    votes: "210K",
    genres: ["Action", "Thriller"],
    language: "Telugu",
    releaseDate: "Dec 22, 2023"
  },
  {
    id: 14,
    title: "Dunki",
    poster: "https://image.tmdb.org/t/p/w500/4dxI3DZMoCUwNRvhQqydyzgOoJE.jpg",
    rating: 7.4,
    votes: "180K",
    genres: ["Comedy", "Drama"],
    language: "Hindi",
    releaseDate: "Dec 21, 2023"
  },
  {
    id: 15,
    title: "John Wick: Chapter 4",
    poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    rating: 8.2,
    votes: "560K",
    genres: ["Action", "Thriller"],
    language: "English",
    releaseDate: "Mar 24, 2023"
  },
  {
    id: 16,
    title: "Kalki 2898 AD",
    poster: "https://image.tmdb.org/t/p/w500/mICNSZ6QhKGLpG8GIisOfei5zrf.jpg",
    rating: 7.8,
    votes: "290K",
    genres: ["Sci-Fi", "Action"],
    language: "Telugu",
    releaseDate: "Jun 27, 2024"
  }
];

export const languages = ["All", "Hindi", "English", "Telugu", "Tamil", "Kannada"];
export const genres = ["Action", "Comedy", "Drama", "Thriller", "Sci-Fi", "Adventure", "Romance"];
