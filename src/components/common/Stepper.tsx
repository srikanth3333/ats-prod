import { Steps } from "antd";
import React from "react";

interface StepperProps {
  steps: Array<{
    title: string;
    description?: string;
    content?: React.ReactNode;
  }>;
  current: number;
  setCurrent: (current: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, current }) => {
  const items = steps.map((item: any) => ({
    key: item.title,
    title: item.title,
    description: item.description,
  }));

  return (
    <div className="flex flex-wrap gap-6 bg-white p-5 rounded-lg shadow-lg mb-20">
      <div className="flex-1">
        <Steps
          current={current}
          items={items}
          direction="vertical"
          className="space-y-6"
        />
      </div>
      <div className="flex-3">
        <div>{steps[current].content}</div>
      </div>
    </div>
  );
};

export default Stepper;
