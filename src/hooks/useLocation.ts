import { useState, useEffect, useCallback } from "react";
import { API } from "@/lib/api";

export interface SavedLocation {
  id: string;
  icon: "home" | "office" | "gym";
  label: string;
  address: string;
  zone: string;
  zoneType: "elite" | "wellness";
  phone: string;
  distance: string;
  favorite: boolean;
}

export interface DeliveryZone {
  id: number;
  name: string;
  radius_km: number;
  delivery_fee: number;
  min_order_value: number;
}

export function useLocation() {
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [activeLocation, setActiveLocation] = useState<SavedLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [locRes, zoneRes] = await Promise.all([
          API.getSavedLocations(),
          API.getZones(),
        ]);
        setLocations(locRes.locations || locRes);
        setZones(zoneRes.zones || zoneRes);
        setActiveLocation(API.getActiveLocation());
      } catch (e) {
        console.error("[Location] Load failed:", e);
        setActiveLocation(API.getActiveLocation());
      } finally {
        setLoading(false);
      }
    };
    load();

    const handler = (e: any) => setActiveLocation(e.detail);
    window.addEventListener("locationChanged", handler);
    return () => window.removeEventListener("locationChanged", handler);
  }, []);

  const selectLocation = useCallback(async (loc: SavedLocation) => {
    try {
      await API.setActiveLocation(loc);
      setActiveLocation(loc);
      return true;
    } catch (e) {
      console.error("[Location] Select failed:", e);
      return false;
    }
  }, []);

  const addLocation = useCallback(async (loc: Omit<SavedLocation, "id">) => {
    try {
      const res = await API.saveLocation(loc);
      const newLoc = res.location || res;
      setLocations((prev) => [...prev, newLoc]);
      return newLoc;
    } catch (e) {
      console.error("[Location] Add failed:", e);
      return null;
    }
  }, []);

  const checkCurrentLocation = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await API.checkDelivery(pos.coords.latitude, pos.coords.longitude);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        },
        (err) => reject(err)
      );
    });
  }, []);

  return {
    locations,
    zones,
    activeLocation,
    loading,
    selectLocation,
    addLocation,
    checkCurrentLocation,
  };
}
