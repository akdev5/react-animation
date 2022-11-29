import { useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSprings, animated } from '@react-spring/three';

const COLORS = ['blue', 'hotpink', 'orange', 'red'];

const Ball = ({ color, ...props }) => {
  return (
    <animated.mesh {...props}>
      <sphereBufferGeometry args={[0.5, 32, 16]} />
      <meshStandardMaterial color={color} />
    </animated.mesh>
  )
};

const Animation = () => {
  const [isActive, setIsActive] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(10);

  const [springs, api] = useSprings(4, () => ({
    y: 0,
    from: { y: 0 },
    to: [{ y: 1 }, { y: 0 }],
    delay: 500,
    loop: true,
    config: { tension: 120, duration: 500, mass: 2, velocity: 5, },
    // onChange: (result) => {
    //   if (!isNaN(result)) {
    //     const unit = Math.round(result / duration * 50) * 10;
    //     setTime(time => {
    //       if (time === 100 && unit >= 0) return 0;
    //       return time <= unit ? unit : 100 - unit;
    //     });
    //   }
    // }
  }));

  const handleOnClick = (e) => {
    e.preventDefault();

    setIsActive(!isActive);

    if (isActive) {
      api.pause();
    } else {
      api.resume();
    }
  };

  const handleChangeTimeline = (e) => {
    const value = parseInt(e.target.value);
    setTime(value);

    api.start(() => ({
      y: value / 100,
    }));
  };

  const handleChangeDuration = (e) => {
    const value = parseInt(e.target.value) > 100 ? 100 : parseInt(e.target.value);
    setDuration(value);

    api.start(() => ({
      config: {
        duration: value * 50,
      },
    }));
  };

  return (
    <div className="flex flex-row justify-center items-center min-h-screen">
      <div className="basis-2/3 bg-white border rounded-lg shadow-xl p-8">
        <div className="mb-7">
          <Canvas style={{ height: 500 }}>
            <pointLight position={[0, 0, 5]} />
            {springs.map((styles, index) => (
              <Ball
                key={index}
                position={styles.y.interpolate((y) => [(-3 + index * 2), index % 2 === 1 ? y : -y, 0])}
                color={COLORS[index]}
              />
            ))}
            <OrbitControls />
          </Canvas>
        </div>
        <div className="flex flex-row justify-center items-center gap-x-4">
          <button
            className="block bg-blue-500 rounded-lg p-2 hover:bg-blue-600 text-white w-32"
            onClick={handleOnClick}
          >
            {isActive ? 'Pause' : 'Start' }
          </button>
          <input
            type="range"
            className="w-full h-6 focus:outline-none focus:ring-0 focus:shadow-none"
            min={0}
            max={100}
            value={time}
            onChange={handleChangeTimeline}
          />
          <input
            type="number"
            className="w-20 h-6 border-solid border-current pl-2 border outline-0"
            min={1}
            max={100}
            value={duration}
            onChange={handleChangeDuration}
          />
        </div>
      </div>
    </div>
  );
};

export default Animation;
