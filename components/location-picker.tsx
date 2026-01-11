"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, LoaderCircle, Search, MapPinned, Locate } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LocationSuggestion = {
  display_name: string;
  place_id: number;
  address: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    city_district?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
    [key: string]: string | undefined;
  };
};

interface LocationPickerProps {
  className?: string;
  autoDetectOnLoad?: boolean;
  defaultLocation?: string;
  onChange?: (location: string) => void;
  variant?: "popover" | "inline";
  placeholder?: string;
}

const API_URL = "https://nominatim.openstreetmap.org";

export function LocationPicker({
  className,
  autoDetectOnLoad = false,
  defaultLocation = "",
  onChange,
  variant = "popover",
  placeholder = "Ciudad o localidad de Argentina",
}: LocationPickerProps) {
  const [activeCity, setActiveCity] = useState(defaultLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFormattedCityName = useCallback(
    (address: LocationSuggestion["address"]) => {
      return (
        address?.city ||
        address?.town ||
        address?.village ||
        address?.suburb ||
        address?.city_district ||
        address?.county ||
        ""
      );
    },
    []
  );

  const getLocation = useCallback(
    async (lat: number, long: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_URL}/reverse?lat=${lat}&lon=${long}&format=json&addressdetails=1`
        );
        const data = await res.json();

        if (data.address?.country_code !== "ar") {
          setError("Ubicación detectada fuera de Argentina");
          return;
        }

        const city = getFormattedCityName(data.address);
        if (city) {
          setActiveCity(city);
        }
      } catch (err) {
        console.error("Error al obtener ubicación:", err);
        setError("Error al conectar con el servicio de mapas");
      } finally {
        setIsLoading(false);
      }
    },
    [getFormattedCityName]
  );

  const searchLocation = useCallback(async () => {
    if (!locationSearch.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(
          locationSearch
        )}&format=json&addressdetails=1&countrycodes=ar&limit=1`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const place = data[0];
        const city = getFormattedCityName(place.address);

        setActiveCity(city);
        setLocationSearch("");
        setSuggestions([]);
        setIsPopoverOpen(false);
      } else {
        setError("No se encontraron resultados en Argentina");
      }
    } catch (err) {
      console.error("Error al buscar ubicación:", err);
      setError("Error en la búsqueda");
    } finally {
      setIsLoading(false);
    }
  }, [locationSearch, getFormattedCityName]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsFetchingSuggestions(true);
    try {
      const res = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5&countrycodes=ar`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error al obtener sugerencias:", err);
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getLocation(latitude, longitude);
      },
      (err) => {
        setError("No se pudo obtener tu ubicación actual");
        setIsLoading(false);
        console.log(err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [getLocation]);

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    const city = getFormattedCityName(suggestion.address);
    setActiveCity(city);
    setLocationSearch("");
    setSuggestions([]);
    setIsPopoverOpen(false);
  };

  const formatDisplayName = (suggestion: LocationSuggestion) => {
    const main = getFormattedCityName(suggestion.address);
    const state = suggestion.address?.state || "";

    if (main && state && main !== state) {
      return `${main}, ${state}`;
    }
    return main || suggestion.display_name.split(",")[0];
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(locationSearch);
    }, 400);

    return () => clearTimeout(handler);
  }, [locationSearch, fetchSuggestions]);

  useEffect(() => {
    if (!isPopoverOpen) {
      setSuggestions([]);
      setError(null);
    }
  }, [isPopoverOpen]);

  useEffect(() => {
    if (autoDetectOnLoad && !activeCity) {
      getCurrentLocation();
    }
  }, [autoDetectOnLoad, activeCity, getCurrentLocation]);

  useEffect(() => {
    if (onChange && activeCity) {
      onChange(activeCity);
    }
  }, [activeCity, onChange]);

  const SearchControls = (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          placeholder={placeholder}
          value={
            variant === "inline" && activeCity ? activeCity : locationSearch
          }
          onChange={(e) => {
            const val = e.target.value;
            setLocationSearch(val);
            if (variant === "inline" && activeCity && val !== activeCity) {
              setActiveCity("");
            }
          }}
          onKeyUp={(e) =>
            e.key === "Enter" && suggestions.length === 0 && searchLocation()
          }
          className="border-border focus:border-primary focus:ring-primary/20 bg-background text-foreground"
        />
      </div>

      <Button
        className="rounded-md h-10 w-10 p-0 bg-primary hover:bg-primary/90 text-primary-foreground"
        variant="outline"
        onClick={searchLocation}
        disabled={isLoading || !locationSearch.trim()}
        title="Buscar Ubicación"
      >
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="outline"
        onClick={getCurrentLocation}
        className="rounded-md h-10 w-10 p-0 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
        title="Usar Mi Ubicación"
      >
        <Locate className="h-4 w-4" />
      </Button>
    </div>
  );

  const SuggestionsList = (
    <>
      {suggestions.length > 0 && (
        <div className="mt-2 w-full bg-background rounded-md border border-border shadow-lg max-h-60 overflow-y-auto z-50">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border last:border-0 transition-colors"
              onClick={() => selectSuggestion(suggestion)}
            >
              <div className="flex items-start">
                <MapPinned
                  size={16}
                  className="mt-0.5 mr-2 shrink-0 text-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {formatDisplayName(suggestion)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-60">
                    {suggestion.display_name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFetchingSuggestions && suggestions.length === 0 && (
        <div className="mt-2 p-4 text-center border rounded-md border-border bg-background">
          <LoaderCircle
            size={20}
            className="animate-spin mx-auto text-primary"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Buscando en Argentina...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-center">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}
    </>
  );

  if (variant === "inline") {
    return (
      <div className={cn("w-full max-w-sm space-y-2", className)}>
        {SearchControls}
        {SuggestionsList}
      </div>
    );
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-2 text-muted-foreground hover:text-foreground border-b border-transparent hover:border-primary cursor-pointer px-3 py-2 transition-colors",
            className
          )}
        >
          <MapPin size={16} className="text-primary" />
          {isLoading ? (
            <div className="flex items-center gap-1">
              <LoaderCircle size={14} className="animate-spin" />
              <span className="text-sm">Localizando...</span>
            </div>
          ) : (
            <span className="text-sm font-medium">
              {activeCity.length > 20
                ? activeCity.slice(0, 20) + "..."
                : activeCity || "Seleccioná la Ubicación del Evento"}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 shadow-xl dark:bg-background border-border"
        side="bottom"
        align="start"
        sideOffset={8}
      >
        {SearchControls}
        {SuggestionsList}
      </PopoverContent>
    </Popover>
  );
}
