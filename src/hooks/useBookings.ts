import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import type { Json } from "@/integrations/supabase/types";

export type Booking = Tables<"bookings">;
export type BookingInsert = TablesInsert<"bookings">;

export const useBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          movies (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

interface CreateBookingInput {
  movie_id: string;
  show_date: string;
  show_time: string;
  seats: number;
  total_amount: number;
  status: "pending" | "confirmed" | "paid" | "cancelled";
  seat_details?: { id: string; category: string }[];
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (booking: CreateBookingInput) => {
      if (!user) throw new Error("User not authenticated");

      // Build the insert object
      const insertData = {
        movie_id: booking.movie_id,
        show_date: booking.show_date,
        show_time: booking.show_time,
        seats: booking.seats,
        total_amount: booking.total_amount,
        status: booking.status,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("bookings")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      // If seat_details provided, update the booking with it
      if (booking.seat_details && data) {
        await supabase
          .from("bookings")
          .update({ seat_details: booking.seat_details as Json })
          .eq("id", data.id);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
      paymentId,
    }: {
      bookingId: string;
      status: "pending" | "confirmed" | "paid" | "cancelled";
      paymentId?: string;
    }) => {
      const updateData: { status: typeof status; payment_id?: string } = { status };
      if (paymentId) {
        updateData.payment_id = paymentId;
      }

      const { data, error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
