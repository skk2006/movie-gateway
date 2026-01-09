import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Theater = Tables<"theaters">;
export type Showtime = Tables<"showtimes"> & {
  theaters?: Theater;
};

export const useShowtimes = (movieId: string, date?: string) => {
  return useQuery({
    queryKey: ["showtimes", movieId, date],
    queryFn: async () => {
      let query = supabase
        .from("showtimes")
        .select(`
          *,
          theaters (*)
        `)
        .eq("movie_id", movieId)
        .order("show_time", { ascending: true });

      if (date) {
        query = query.eq("show_date", date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Showtime[];
    },
    enabled: !!movieId,
  });
};

// Group showtimes by theater
export interface TheaterWithShowtimes {
  theater: Theater;
  showtimes: Showtime[];
}

export const useGroupedShowtimes = (movieId: string, date?: string) => {
  const { data: showtimes, isLoading, error } = useShowtimes(movieId, date);

  const groupedData: TheaterWithShowtimes[] = [];

  if (showtimes) {
    const theaterMap = new Map<string, TheaterWithShowtimes>();

    showtimes.forEach((showtime) => {
      if (showtime.theaters) {
        const theaterId = showtime.theater_id;
        if (!theaterMap.has(theaterId)) {
          theaterMap.set(theaterId, {
            theater: showtime.theaters,
            showtimes: [],
          });
        }
        theaterMap.get(theaterId)!.showtimes.push(showtime);
      }
    });

    theaterMap.forEach((value) => {
      groupedData.push(value);
    });
  }

  return { data: groupedData, isLoading, error };
};
