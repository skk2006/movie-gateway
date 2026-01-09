import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Movie = Tables<"movies">;

export const useMovies = (language?: string, genre?: string) => {
  return useQuery({
    queryKey: ["movies", language, genre],
    queryFn: async () => {
      let query = supabase.from("movies").select("*").eq("is_available", true);

      if (language && language !== "All") {
        query = query.eq("language", language);
      }

      if (genre && genre !== "All") {
        query = query.contains("genres", [genre]);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: ["movies", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("is_featured", true)
        .eq("is_available", true)
        .limit(6);

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useMovie = (movieId: string) => {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", movieId)
        .maybeSingle();

      if (error) throw error;
      return data as Movie | null;
    },
    enabled: !!movieId,
  });
};
