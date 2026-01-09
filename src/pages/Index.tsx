import Header from "@/components/Header";
import FeaturedMovies from "@/components/FeaturedMovies";
import MovieListings from "@/components/MovieListings";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <FeaturedMovies />
        <MovieListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
