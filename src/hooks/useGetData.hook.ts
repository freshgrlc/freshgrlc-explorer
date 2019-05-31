import { useState, useEffect } from "react";

export function useGetData<DataType>(url: string): DataType | undefined {
  const [data, setData] = useState<DataType | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const dataNew = (await (await fetch(url)).json()) as DataType;
      if (!cancelled) {
        setData(dataNew);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return data;
}
