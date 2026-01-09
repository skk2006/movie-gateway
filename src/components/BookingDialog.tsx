import { useState } from "react";
import { Star, Clock, Calendar } from "lucide-react";
import { Movie } from "@/hooks/useMovies";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface BookingDialogProps {
  movie: Movie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const showTimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
const TICKET_PRICE = 250;

const BookingDialog = ({ movie, open, onOpenChange }: BookingDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const updateBookingStatus = useUpdateBookingStatus();
  
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [seats, setSeats] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const totalAmount = seats * TICKET_PRICE;

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in to book tickets");
      navigate("/login");
      return;
    }

    if (!showDate || !showTime) {
      toast.error("Please select date and time");
      return;
    }

    setProcessing(true);

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        show_date: showDate,
        show_time: showTime,
        seats,
        total_amount: totalAmount,
        status: "pending",
      });

      setBookingId(booking.id);
      setStep("payment");
      toast.success("Booking created! Proceed to payment.");
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;

    setProcessing(true);
    
    // Mock payment processing with 2 second delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await updateBookingStatus.mutateAsync({
        bookingId,
        status: "paid",
        paymentId: `PAY-${Date.now()}`,
      });

      setStep("success");
      
      // Mock email notification via toast
      toast.success("📧 Booking confirmation email sent!", {
        description: `Your tickets for ${movie.title} have been booked successfully. Check your email for details.`,
        duration: 5000,
      });
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setStep("details");
    setShowDate("");
    setShowTime("");
    setSeats(1);
    setBookingId(null);
    onOpenChange(false);
  };

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {step === "success" ? "Booking Confirmed!" : `Book Tickets - ${movie.title}`}
          </DialogTitle>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-4">
            {/* Movie Info */}
            <div className="flex gap-4">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{movie.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{movie.rating}/10</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration_minutes} mins</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {movie.genres.join(", ")} • {movie.language}
                </p>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-foreground">Select Date</Label>
              <Input
                type="date"
                value={showDate}
                onChange={(e) => setShowDate(e.target.value)}
                min={minDate}
                className="bg-muted border-border text-foreground"
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label className="text-foreground">Select Show Time</Label>
              <Select value={showTime} onValueChange={setShowTime}>
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {showTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seats Selection */}
            <div className="space-y-2">
              <Label className="text-foreground">Number of Seats</Label>
              <Select value={seats.toString()} onValueChange={(v) => setSeats(parseInt(v))}>
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Seat" : "Seats"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Ticket Price</span>
                <span>₹{TICKET_PRICE} x {seats}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground mt-2 pt-2 border-t border-border">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              className="w-full bg-primary text-primary-foreground"
              disabled={processing || !showDate || !showTime}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Payment Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Movie</span>
                  <span>{movie.title}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Date</span>
                  <span>{showDate}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Time</span>
                  <span>{showTime}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Seats</span>
                  <span>{seats}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border mt-2">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Click below to simulate payment processing
            </p>

            <Button
              onClick={handlePayment}
              className="w-full bg-primary text-primary-foreground"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ₹${totalAmount}`
              )}
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center">
            <div className="text-6xl">🎉</div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Booking Successful!
              </h3>
              <p className="text-muted-foreground mt-2">
                Your tickets for <strong>{movie.title}</strong> have been booked.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Date</span>
                  <span>{showDate}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Time</span>
                  <span>{showTime}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Seats</span>
                  <span>{seats}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border mt-2">
                  <span>Amount Paid</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
