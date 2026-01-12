import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SeatSelectorProps {
  maxSeats: number;
  availableSeats: number;
  onSeatsSelected: (seats: string[]) => void;
}

// Generate a theater layout with some seats already booked
const generateTheaterLayout = (availableSeats: number) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;
  const totalSeats = rows.length * seatsPerRow;
  const bookedCount = Math.max(0, totalSeats - availableSeats);
  
  // Randomly mark some seats as booked
  const bookedSeats = new Set<string>();
  const allSeats: string[] = [];
  
  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      allSeats.push(`${row}${i}`);
    }
  });
  
  // Randomly select seats to be booked
  const shuffled = [...allSeats].sort(() => Math.random() - 0.5);
  for (let i = 0; i < bookedCount && i < shuffled.length; i++) {
    bookedSeats.add(shuffled[i]);
  }
  
  return { rows, seatsPerRow, bookedSeats };
};

const SeatSelector = ({ maxSeats, availableSeats, onSeatsSelected }: SeatSelectorProps) => {
  const [layout] = useState(() => generateTheaterLayout(availableSeats));
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    onSeatsSelected(selectedSeats);
  }, [selectedSeats, onSeatsSelected]);

  const handleSeatClick = (seatId: string) => {
    if (layout.bookedSeats.has(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      }
      if (prev.length >= maxSeats) {
        // Replace the first selected seat with the new one
        return [...prev.slice(1), seatId];
      }
      return [...prev, seatId];
    });
  };

  const getSeatStatus = (seatId: string) => {
    if (layout.bookedSeats.has(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  return (
    <div className="space-y-4">
      {/* Screen */}
      <div className="relative mb-8">
        <div className="w-full h-2 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full" />
        <div className="text-center text-xs text-muted-foreground mt-2 uppercase tracking-widest">
          Screen
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex justify-center gap-6 text-xs mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border-2 border-emerald-500 bg-transparent" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-500" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-muted" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-fit mx-auto">
          {layout.rows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-1 mb-1">
              <span className="w-6 text-xs text-muted-foreground font-medium text-right mr-2">
                {row}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: layout.seatsPerRow }, (_, i) => {
                  const seatNum = i + 1;
                  const seatId = `${row}${seatNum}`;
                  const status = getSeatStatus(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={status === "booked"}
                      className={cn(
                        "w-7 h-7 rounded text-xs font-medium transition-all flex items-center justify-center",
                        status === "available" &&
                          "border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 cursor-pointer",
                        status === "selected" &&
                          "bg-emerald-500 text-white border-2 border-emerald-500 cursor-pointer",
                        status === "booked" &&
                          "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                      aria-label={`Seat ${seatId} - ${status}`}
                    >
                      {seatNum}
                    </button>
                  );
                })}
              </div>
              <span className="w-6 text-xs text-muted-foreground font-medium text-left ml-2">
                {row}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selection Info */}
      <div className="bg-muted/30 rounded-lg p-3 text-center">
        <p className="text-sm text-muted-foreground">
          {selectedSeats.length === 0 ? (
            <>Select {maxSeats} {maxSeats === 1 ? "seat" : "seats"}</>
          ) : (
            <>
              Selected: <span className="text-foreground font-medium">{selectedSeats.sort().join(", ")}</span>
              {selectedSeats.length < maxSeats && (
                <span className="text-muted-foreground"> ({maxSeats - selectedSeats.length} more to select)</span>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default SeatSelector;
