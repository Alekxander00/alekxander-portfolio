// components/EasterEggIndicators.jsx
import React from 'react';
import useTotK from '../hooks/useTotK';

const EasterEggIndicators = () => {
  const { isZKeyPressed } = useTotK();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let interval;
    if (isZKeyPressed) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + (100 / 30); // 30 incrementos en 3 segundos
        });
      }, 100);
    } else {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isZKeyPressed]);

  return (
    <>
      {isZKeyPressed && (
        <>
          <div className="z-key-indicator">
            Z
          </div>
          <div className="z-progress">
            <div 
              className="z-progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default EasterEggIndicators;