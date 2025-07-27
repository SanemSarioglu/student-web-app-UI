import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    // Check if device supports hover (not touch device)
    const mediaQuery = window.matchMedia('(hover: hover)');
    
    if (mediaQuery.matches) {
      document.addEventListener('mousemove', updatePosition);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        document.removeEventListener('mousemove', updatePosition);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out"
      style={{
        left: position.x - 8,
        top: position.y - 8,
        transform: `scale(${isClicking ? 0.8 : 1})`,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div
        className={`w-4 h-4 rounded-full border-2 transition-colors duration-150 ${
          isClicking
            ? 'bg-blue-500 border-blue-600'
            : 'bg-transparent border-gray-600'
        }`}
      />
    </div>
  );
};

export default CustomCursor; 