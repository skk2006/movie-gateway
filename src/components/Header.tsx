import { Search, MapPin, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const navLinks = ["Movies", "Events", "Sports", "Plays", "Activities"];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U";
    return user.user_metadata.full_name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-header border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">
              book<span className="text-foreground">my</span>show
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* City Selector */}
            <button className="hidden sm:flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors">
              <MapPin className="h-4 w-4" />
              <span>Mumbai</span>
            </button>

            {/* Auth Section */}
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-border">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem disabled className="text-muted-foreground">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem asChild>
                        <Link to="/bookings" className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="flex items-center gap-2 cursor-pointer text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to="/login"
                    className="hidden sm:block px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded hover:bg-primary/90 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6 py-2">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          {/* Mobile Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for Movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Mobile Nav Links */}
          <nav className="flex flex-col border-t border-border">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="px-4 py-3 text-sm text-foreground hover:bg-muted/50 border-b border-border/50"
              >
                {link}
              </a>
            ))}
            <div className="flex items-center justify-between px-4 py-3">
              <button className="flex items-center gap-1 text-sm text-foreground">
                <MapPin className="h-4 w-4" />
                <span>Mumbai</span>
              </button>
              {!loading && !user && (
                <Link
                  to="/login"
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
