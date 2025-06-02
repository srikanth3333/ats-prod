"use client";

import { Typography } from "antd";
import React, { useEffect, useState } from "react";
const { Title } = Typography;

type Props = {
  startTime: string; // ISO format date-time string
};

const CountdownTimer: React.FC<Props> = ({ startTime }) => {
  const [elapsed, setElapsed] = useState<string>("");

  useEffect(() => {
    const start = new Date(startTime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = now - start;

      if (diff < 0) {
        setElapsed("Start time is in the future");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsed(
        `${String(days).padStart(2, "0")}d ` +
          `${String(hours).padStart(2, "0")}h ` +
          `${String(minutes).padStart(2, "0")}m ` +
          `${String(seconds).padStart(2, "0")}s`
      );
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // initial render

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="mt-3">
      <p>{elapsed}</p>
    </div>
  );
};

export default CountdownTimer;
