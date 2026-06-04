import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function ChartContainer({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      layout: {
        background: { color: "#0B0F14" },
        textColor: "#D1D5DB"
      },
      grid: {
        vertLines: { color: "#1F2937" },
        horzLines: { color: "#1F2937" }
      },
      height: 400
    });

    const candleSeries = chart.addCandlestickSeries();

    if (data?.length) {
      candleSeries.setData(
        data.map((c) => ({
          time: c.originalTime / 1000,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close
        }))
      );
    }

    return () => chart.remove();
  }, [data]);

  return <div ref={chartRef} className="w-full h-full" />;
}