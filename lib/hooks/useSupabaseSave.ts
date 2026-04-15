import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SAVE_INTERVAL } from "@/lib/constants/config";
import { DHTData, AirData } from "@/lib/hooks/useSensors";

export function useSupabaseSave(
  sensor1: DHTData,
  sensor2: DHTData,
  aire: AirData
){
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const s1Ref = useRef(sensor1);
  const s2Ref = useRef(sensor2);
  const airRef = useRef(aire);

  useEffect(() => { s1Ref.current = sensor1; }, [sensor1]);
  useEffect(() => { s2Ref.current = sensor2; }, [sensor2]);
  useEffect(() => { airRef.current = aire; }, [aire]);

  useEffect(() => {
    const saveToSupabase = async () => {
      const s1 = s1Ref.current;
      const s2 = s2Ref.current;
      const air = airRef.current;

      if (s1.error && s2.error && air.error) return;

      const { error } = await supabase.from("mediciones").insert({
        sensor1_humedad: s1.humedad,
        sensor1_temperatura: s1.temperatura,
        sensor2_humedad: s2.humedad,
        sensor2_temperatura: s2.temperatura,
        aire_ppm: air.ppm,
      });

      if (!error) {
        const now = new Date();
        setLastSaved(
          `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`
        );
      }
    };

    const interval = setInterval(saveToSupabase, SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { lastSaved };
}