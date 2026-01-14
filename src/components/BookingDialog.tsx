import { useState } from "react";
import { Star, Clock, MapPin, CalendarIcon, CreditCard, Smartphone, Building2, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { Movie } from "@/hooks/useMovies";
import { useGroupedShowtimes } from "@/hooks/useShowtimes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface BookingDialogProps {
  movie: Movie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import SeatSelector, { SelectedSeat, SeatCategory } from "./SeatSelector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

type BookingStep = "theaters" | "selectSeats" | "seats" | "payment" | "success";
type PaymentMethod = "debit" | "credit" | "upi";

const BookingDialog = ({ movie, open, onOpenChange }: BookingDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const updateBookingStatus = useUpdateBookingStatus();

  const [step, setStep] = useState<BookingStep>("theaters");
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedShowtime, setSelectedShowtime] = useState<{
    id: string;
    time: string;
    price: number;
    theaterId: string;
    theaterName: string;
    availableSeats: number;
  } | null>(null);
  const [seats, setSeats] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [seatCategories] = useState<SeatCategory[]>([
    { name: "Regular", category: "regular", price_multiplier: 1.0, color: "#22c55e", description: "Standard seating" },
    { name: "Premium", category: "premium", price_multiplier: 1.5, color: "#3b82f6", description: "Better view & legroom" },
    { name: "VIP", category: "vip", price_multiplier: 2.0, color: "#a855f7", description: "Recliner + snacks" },
  ]);
  const [processing, setProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("debit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const dateString = format(selectedDate, "yyyy-MM-dd");
  const { data: groupedShowtimes, isLoading } = useGroupedShowtimes(movie.id, dateString);

  // Calculate total amount based on selected seats and their categories
  const calculateTotalAmount = () => {
    if (!selectedShowtime) return 0;
    if (selectedSeats.length === 0) {
      // Before seat selection, show estimate with base price
      return seats * selectedShowtime.price;
    }
    // After seat selection, calculate based on categories
    return selectedSeats.reduce((total, seat) => {
      const category = seatCategories.find(c => c.category === seat.category);
      const multiplier = category?.price_multiplier || 1;
      return total + (selectedShowtime.price * multiplier);
    }, 0);
  };
  
  const totalAmount = Math.round(calculateTotalAmount());

  const handleSelectShowtime = (
    showtimeId: string,
    time: string,
    price: number,
    theaterId: string,
    theaterName: string,
    availableSeats: number
  ) => {
    if (!user) {
      toast.error("Please sign in to book tickets");
      navigate("/login");
      return;
    }

    setSelectedShowtime({ id: showtimeId, time, price, theaterId, theaterName, availableSeats });
    setStep("seats");
  };

  const handleProceedToSeatSelection = () => {
    setSelectedSeats([]);
    setStep("selectSeats");
  };

  const handleBooking = async () => {
    if (!selectedShowtime) return;

    setProcessing(true);

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        show_date: dateString,
        show_time: selectedShowtime.time,
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
        description: `Your tickets for ${movie.title} have been booked successfully.`,
        duration: 5000,
      });
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setStep("theaters");
    setSelectedDate(addDays(new Date(), 1));
    setSelectedShowtime(null);
    setSeats(1);
    setSelectedSeats([]);
    setBookingId(null);
    setPaymentMethod("debit");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setUpiId("");
    onOpenChange(false);
  };

  const isPaymentFormValid = () => {
    if (paymentMethod === "upi") {
      return upiId.includes("@");
    }
    return cardNumber.length >= 16 && cardExpiry.length >= 5 && cardCvv.length >= 3;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    return cleaned;
  };

  const minDate = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), 7);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {step === "success" ? "Booking Confirmed!" : `Book Tickets`}
          </DialogTitle>
        </DialogHeader>

        {/* Movie Header */}
        {step !== "success" && (
          <div className="flex gap-4 pb-4 border-b border-border">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{movie.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{movie.rating}/10</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{movie.duration_minutes} mins</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {movie.genres.join(", ")} • {movie.language}
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Select Theater & Showtime */}
        {step === "theaters" && (
          <div className="space-y-4">
            {/* Date Picker */}
            <div className="flex items-center gap-4">
              <Label className="text-foreground whitespace-nowrap">Select Date:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal bg-muted border-border",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "EEE, dd MMM") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => date < minDate || date > maxDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Theaters Heading */}
            <h2 className="text-xl font-bold text-foreground pt-2">
              Theaters Showing {movie.title}
            </h2>

            {/* Theaters List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-muted/50 rounded-lg">
                    <Skeleton className="h-5 w-1/3 bg-muted mb-2" />
                    <Skeleton className="h-4 w-1/2 bg-muted mb-3" />
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} className="h-10 w-20 bg-muted" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : groupedShowtimes && groupedShowtimes.length > 0 ? (
              <div className="space-y-4">
                {groupedShowtimes.map(({ theater, showtimes }) => (
                  <div
                    key={theater.id}
                    className="p-4 bg-muted/30 rounded-lg border border-border"
                  >
                    {/* Theater Info */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-foreground">{theater.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{theater.location}</span>
                      </div>
                      {theater.amenities && theater.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {theater.amenities.map((amenity) => (
                            <Badge
                              key={amenity}
                              variant="secondary"
                              className="text-xs bg-secondary/50"
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Showtimes */}
                    <div className="flex flex-wrap gap-2">
                      {showtimes.map((showtime) => (
                        <button
                          key={showtime.id}
                          onClick={() =>
                            handleSelectShowtime(
                              showtime.id,
                              showtime.show_time,
                              showtime.price,
                              theater.id,
                              theater.name,
                              showtime.available_seats || 100
                            )
                          }
                          className="px-4 py-2 border border-primary/50 rounded-lg text-sm hover:bg-primary hover:text-primary-foreground transition-colors group"
                        >
                          <div className="font-medium text-foreground group-hover:text-primary-foreground">
                            {showtime.show_time}
                          </div>
                          <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/80">
                            ₹{showtime.price}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No shows available for {format(selectedDate, "dd MMM yyyy")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try selecting a different date
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Number of Seats */}
        {step === "seats" && selectedShowtime && (
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="text-sm text-muted-foreground mb-2">Selected Show</div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{selectedShowtime.theaterName}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, "EEE, dd MMM")} • {selectedShowtime.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Price per ticket</p>
                  <p className="font-semibold text-foreground">₹{selectedShowtime.price}</p>
                </div>
              </div>
            </div>

            {/* Number of Seats Selection */}
            <div className="space-y-2">
              <Label className="text-foreground">How many seats do you want to book?</Label>
              <Select value={seats.toString()} onValueChange={(v) => setSeats(parseInt(v))}>
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
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
                <span>₹{selectedShowtime.price} x {seats}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground mt-2 pt-2 border-t border-border">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedShowtime(null);
                  setStep("theaters");
                }}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleProceedToSeatSelection}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Select Seats
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Select Specific Seats */}
        {step === "selectSeats" && selectedShowtime && (
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{selectedShowtime.theaterName}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, "EEE, dd MMM")} • {selectedShowtime.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{seats} {seats === 1 ? "seat" : "seats"}</p>
                  <p className="font-semibold text-foreground">₹{totalAmount}</p>
                </div>
              </div>
            </div>

            <SeatSelector
              maxSeats={seats}
              availableSeats={selectedShowtime.availableSeats}
              basePrice={selectedShowtime.price}
              onSeatsSelected={setSelectedSeats}
              categories={seatCategories}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("seats")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleBooking}
                className="flex-1 bg-primary text-primary-foreground"
                disabled={processing || selectedSeats.length !== seats}
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
          </div>
        )}

        {/* Step 4: Payment */}
        {step === "payment" && selectedShowtime && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Booking Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Movie</span>
                  <span className="font-medium text-foreground">{movie.title}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Theater</span>
                  <span>{selectedShowtime.theaterName}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Date & Time</span>
                  <span>{format(selectedDate, "EEE, dd MMM")} • {selectedShowtime.time}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Seats</span>
                  <span className="font-medium text-foreground">{selectedSeats.map(s => s.id).sort().join(", ")}</span>
                </div>
                {/* Show category breakdown */}
                <div className="space-y-1 pt-1">
                  {seatCategories.map(cat => {
                    const catSeats = selectedSeats.filter(s => s.category === cat.category);
                    if (catSeats.length === 0) return null;
                    return (
                      <div key={cat.category} className="flex justify-between text-xs text-muted-foreground">
                        <span style={{ color: cat.color }}>{cat.name} x{catSeats.length}</span>
                        <span>₹{Math.round(catSeats.length * selectedShowtime.price * cat.price_multiplier)}</span>
                      </div>
                    );
                  })}
                  <span>Total Amount</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Select Payment Method</h4>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="space-y-3"
              >
                <label
                  htmlFor="debit"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                    paymentMethod === "debit"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="debit" id="debit" />
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Debit Card</p>
                    <p className="text-xs text-muted-foreground">Pay using your bank debit card</p>
                  </div>
                </label>

                <label
                  htmlFor="credit"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                    paymentMethod === "credit"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="credit" id="credit" />
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Credit Card</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex accepted</p>
                  </div>
                </label>

                <label
                  htmlFor="upi"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                    paymentMethod === "upi"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="upi" id="upi" />
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">UPI</p>
                    <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              {(paymentMethod === "debit" || paymentMethod === "credit") && (
                <>
                  <div className="space-y-2">
                    <Label className="text-foreground">Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(cardNumber)}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                      className="bg-muted border-border text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Expiry Date</Label>
                      <Input
                        placeholder="MM/YY"
                        value={formatExpiry(cardExpiry)}
                        onChange={(e) => setCardExpiry(e.target.value.replace(/\//g, ""))}
                        className="bg-muted border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">CVV</Label>
                      <Input
                        placeholder="123"
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className="bg-muted border-border text-foreground"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-2">
                  <Label className="text-foreground">UPI ID</Label>
                  <Input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="bg-muted border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your UPI ID linked to Google Pay, PhonePe, or Paytm
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("selectSeats")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-primary text-primary-foreground"
                disabled={processing || !isPaymentFormValid()}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${totalAmount}`
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === "success" && selectedShowtime && (
          <div className="space-y-4 text-center">
            <div className="text-6xl">🎉</div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Booking Successful!</h3>
              <p className="text-muted-foreground mt-2">
                Your tickets for <strong>{movie.title}</strong> have been booked.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Theater</span>
                  <span>{selectedShowtime.theaterName}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Date</span>
                  <span>{format(selectedDate, "EEE, dd MMM yyyy")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Time</span>
                  <span>{selectedShowtime.time}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Seats</span>
                  <span>{selectedSeats.map(s => s.id).sort().join(", ")}</span>
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
