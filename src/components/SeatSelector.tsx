import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface SeatCategory {
  name: string;
  category: "regular" | "premium" | "vip";
  price_multiplier: number;
  color: string;
  description: string;
}

export interface SelectedSeat {
  id: string;
  category: "regular" | "premium" | "vip";
}

interface SeatSelectorProps {
  maxSeats: number;
  availableSeats: number;
  basePrice: number;
  onSeatsSelected: (seats: SelectedSeat[]) => void;
  categories?: SeatCategory[];
}

const DEFAULT_CATEGORIES: SeatCategory[] = [
  { name: "Regular", category: "regular", price_multiplier: 1.0, color: "#22c55e", description: "Standard seating" },
  { name: "Premium", category: "premium", price_multiplier: 1.5, color: "#3b82f6", description: "Better view & legroom" },
  { name: "VIP", category: "vip", price_multiplier: 2.0, color: "#a855f7", description: "Recliner + snacks" },
];

// Generate a theater layout with seat categories
const generateTheaterLayout = (availableSeats: number) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;
  const totalSeats = rows.length * seatsPerRow;
  const bookedCount = Math.max(0, totalSeats - availableSeats);
  
  // Assign categories to rows
  // Rows A-B: VIP (front), C-D: Premium, E-H: Regular
  const rowCategories: Record<string, "regular" | "premium" | "vip"> = {
    A: "vip",
    B: "vip",
    C: "premium",
    D: "premium",
    E: "regular",
    F: "regular",
    G: "regular",
    H: "regular",
  };
  
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
  
  return { rows, seatsPerRow, bookedSeats, rowCategories };
};

const SeatSelector = ({ 
  maxSeats, 
  availableSeats, 
  basePrice,
  onSeatsSelected,
  categories = DEFAULT_CATEGORIES 
}: SeatSelectorProps) => {
  const [layout] = useState(() => generateTheaterLayout(availableSeats));
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  useEffect(() => {
    onSeatsSelected(selectedSeats);
  }, [selectedSeats, onSeatsSelected]);

  const getCategoryConfig = (category: "regular" | "premium" | "vip") => {
    return categories.find(c => c.category === category) || DEFAULT_CATEGORIES[0];
  };

  const handleSeatClick = (seatId: string, category: "regular" | "premium" | "vip") => {
    if (layout.bookedSeats.has(seatId)) return;

    setSelectedSeats((prev) => {
      const existingIndex = prev.findIndex(s => s.id === seatId);
      if (existingIndex !== -1) {
        return prev.filter((s) => s.id !== seatId);
      }
      if (prev.length >= maxSeats) {
        // Replace the first selected seat with the new one
        return [...prev.slice(1), { id: seatId, category }];
      }
      return [...prev, { id: seatId, category }];
    });
  };

  const getSeatStatus = (seatId: string) => {
    if (layout.bookedSeats.has(seatId)) return "booked";
    if (selectedSeats.some(s => s.id === seatId)) return "selected";
    return "available";
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      const config = getCategoryConfig(seat.category);
      return total + (basePrice * config.price_multiplier);
    }, 0);
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

      {/* Seat Category Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs mb-4 p-3 bg-muted/30 rounded-lg">
        {categories.map((cat) => (
          <div key={cat.category} className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded border-2"
              style={{ borderColor: cat.color, backgroundColor: 'transparent' }}
            />
            <span className="text-muted-foreground">
              {cat.name} (₹{Math.round(basePrice * cat.price_multiplier)})
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-muted" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-fit mx-auto">
          {layout.rows.map((row) => {
            const rowCategory = layout.rowCategories[row];
            const categoryConfig = getCategoryConfig(rowCategory);
            
            return (
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
                        onClick={() => handleSeatClick(seatId, rowCategory)}
                        disabled={status === "booked"}
                        className={cn(
                          "w-7 h-7 rounded text-xs font-medium transition-all flex items-center justify-center",
                          status === "available" && "border-2 hover:opacity-80 cursor-pointer",
                          status === "selected" && "text-white border-2 cursor-pointer",
                          status === "booked" && "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                        style={
                          status === "available"
                            ? { borderColor: categoryConfig.color, color: categoryConfig.color }
                            : status === "selected"
                            ? { backgroundColor: categoryConfig.color, borderColor: categoryConfig.color }
                            : undefined
                        }
                        aria-label={`Seat ${seatId} - ${rowCategory} - ${status}`}
                      >
                        {seatNum}
                      </button>
                    );
                  })}
                </div>
                <span 
                  className="w-16 text-xs font-medium text-left ml-2 px-2 py-0.5 rounded"
                  style={{ color: categoryConfig.color }}
                >
                  {categoryConfig.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selection Info */}
      <div className="bg-muted/30 rounded-lg p-3">
        <div className="text-center">
          {selectedSeats.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Select {maxSeats} {maxSeats === 1 ? "seat" : "seats"}
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Selected: <span className="text-foreground font-medium">
                  {selectedSeats.map(s => s.id).sort().join(", ")}
                </span>
                {selectedSeats.length < maxSeats && (
                  <span className="text-muted-foreground"> ({maxSeats - selectedSeats.length} more to select)</span>
                )}
              </p>
              {selectedSeats.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  {categories.map(cat => {
                    const count = selectedSeats.filter(s => s.category === cat.category).length;
                    if (count === 0) return null;
                    return (
                      <span 
                        key={cat.category}
                        className="px-2 py-1 rounded"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        {count}x {cat.name}: ₹{Math.round(count * basePrice * cat.price_multiplier)}
                      </span>
                    );
                  })}
                </div>
              )}
              <p className="text-sm font-semibold text-foreground pt-2 border-t border-border mt-2">
                Total: ₹{Math.round(calculateTotalPrice())}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
