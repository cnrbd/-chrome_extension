import Plot from "react-plotly.js";
import { useState, useEffect } from "react";
import { stringObjectToJSON } from "../utils/displayMetricsHelpers";
import {
  extractStats,
  calculatePercentage,
} from "../utils/visualizationHelpers";
import { GridLoader } from "react-spinners";
type GraphProps = {
  aiResponse: string;
};

export default function Graph({ aiResponse }: GraphProps) {
  const [statsArray, setStatsArray] = useState<number[]>([]);
  const [responseJSON, setResponseJSON] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const [keys, setKeys] = useState<string[]>([]);
  useEffect(() => {
    if (aiResponse) {
      try {
        const parsedResponse = stringObjectToJSON(aiResponse);
        console.log("keys ", parsedResponse);
        setResponseJSON(parsedResponse);
        setKeys(Object.keys(parsedResponse));
      } catch (error) {
        console.error("Failed to parse response JSON:", error);
      }
    }
  }, [aiResponse]);

  useEffect(() => {
    if (aiResponse && responseJSON) {
      const tempArray = extractStats(responseJSON);
      setStatsArray(tempArray);
      console.log(statsArray);
    }
    if (statsArray.length > 0) {
      setLoading(false);
    }
  }, [responseJSON]);

  return aiResponse && responseJSON ? (
    <Plot
      data={[
        {
          x: keys,
          y: calculatePercentage(statsArray, keys),
          type: "bar",
          marker: {
            color: "#6A9C5E"
          }
        },
      ]}
      layout={{
        title: "Recipe Metrics vs Recommended",
        width: 400,
        height: 400,
        font: {
          family: "LibreBodoni"
        },
        xaxis: {
          title: "Metrics",
        },
        yaxis: {
          title: "Recipe vs Recommended (%)",
        },
      }}
      config={{
        displayModeBar: false,
      }}
      className="text-break"
    />
  ) : (
    <GridLoader
      color={"green"}
      loading={loading}
      size={15}
      aria-label="Loading Spinner"
      data-testid="loader"
      className="z-50 absolute"
    />
  );
}
