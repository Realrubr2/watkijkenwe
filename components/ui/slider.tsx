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

  const handleMove = (clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const newValue = Math.round((percentage * (max - min) + min) / step) * step;
      setCurrentValue(newValue);
      onChange(newValue);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    handleMove(event.clientX);
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    handleMove(event.touches[0].clientX);
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault(); // Prevents scrolling while sliding
    handleMove(event.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div 
      ref={sliderRef}
      className="relative h-6 w-full cursor-pointer touch-auto"
      onMouseDown={handleMouseDown}
      onTouchStart={(event) => {
        handleTouchStart(event);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
      }}
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
