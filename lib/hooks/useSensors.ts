import { useState, useEffect } from "react";
import {
  SENSOR_1_URL,
  SENSOR_2_URL,
  AIRE_URL,
} from "../constants/config";

export interface DHTData {
  humedad: number | null;
  temperatura: number | null;
  error: boolean;
}

export interface AirData {
  ppm: number | null;
  error: boolean;
}

const initialDHT: DHTData = {
  humedad: null,
  temperatura: null,
  error: false,
};

const initialAir: AirData = {
  ppm: null,
  error: false,
};

export function useSensors() {
  const [sensor1, setSensor1] = useState<DHTData>(initialDHT);
  const [sensor2, setSensor2] = useState<DHTData>(initialDHT);
  const [aire, setAire] = useState<AirData>(initialAir);

  useEffect(() => {
    const fetchDHT = (url: string, setter: (d: DHTData) => void) => {
      fetch(url)
        .then((r) => r.json())
        .then((d) =>
          setter({
            humedad: d.humedad,
            temperatura: d.temperatura,
            error: false,
          })
        )
        .catch(() =>
          setter({
            humedad: null,
            temperatura: null,
            error: true,
          })
        );
    };

    const fetchAir = () => {
      fetch(AIRE_URL)
        .then((r) => r.json())
        .then((d) => setAire({ ppm: d.ppm, error: false }))
        .catch(() => setAire({ ppm: null, error: true }));
    };

    const poll = () => {
      fetchDHT(SENSOR_1_URL, setSensor1);
      fetchDHT(SENSOR_2_URL, setSensor2);
      fetchAir();
    };

    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, []);

  return { sensor1, sensor2, aire };
}