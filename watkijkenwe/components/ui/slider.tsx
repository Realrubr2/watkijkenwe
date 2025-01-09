import React, { useState, useEffect, useRef } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ min, max, step, value, onChange }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        const newValue = Math.round((percentage * (max - min) + min) / step) * step;
        setCurrentValue(newValue);
        onChange(newValue);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div 
      ref={sliderRef}
      className="relative h-6 w-full cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-gray-200">
        <div
          className="absolute h-full rounded-full bg-blue-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-2 border-blue-500 shadow"
        style={{ left: `${percentage}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          setCurrentValue(newValue);
          onChange(newValue);
        }}
        className="sr-only"
      />
    </div>
  );
};
