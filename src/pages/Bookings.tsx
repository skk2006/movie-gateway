import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Ticket } from "lucide-react";
import { format } from "date-fns";

const Bookings = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: bookings, isLoading, error } = useBookings();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "confirmed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Bookings</h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-28 rounded bg-muted" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/2 bg-muted" />
                      <Skeleton className="h-4 w-1/3 bg-muted" />
                      <Skeleton className="h-4 w-1/4 bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Failed to load bookings.</p>
            </CardContent>
          </Card>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <Card key={booking.id} className="bg-card border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Movie Poster */}
                    <div className="w-24 sm:w-32 flex-shrink-0">
                      <img
                        src={booking.movies?.poster_url}
                        alt={booking.movies?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {booking.movies?.title}
                        </h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(booking.show_date), "EEE, dd MMM yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{booking.show_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4" />
                          <span>
                            {booking.seats} {booking.seats === 1 ? "Seat" : "Seats"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Paid</span>
                        <span className="font-semibold text-foreground">
                          ₹{booking.total_amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No Bookings Yet</h3>
              <p className="text-muted-foreground mt-1">
                Start exploring movies and book your first ticket!
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;
