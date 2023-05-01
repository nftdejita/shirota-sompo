import styles from "/styles/tcg/game-start.module.css";
import Image from "next/image";
import { useEffect, useState } from 'react';

const GameStart = (props) => {
  const logos = ['/tcg/turn1.png', '/tcg/turn2.png'];
  const [activeLogoIndex, setActiveLogoIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 8000);
    return () => clearInterval(intervalId);
  }, [logos]);

  const closeModal = () => {
    props.gemeStartHandle();
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        {logos.map((logo, index) => (
          <img
            key={logo}
            src={logo}
            alt="ロゴマーク"
            className={`${styles.logo} ${
              activeLogoIndex === index ? styles.activeLogo : ''
            }`}
          />
        ))}
      </div>
      <h1 className={styles.gameTitle}>Insurance Card Game</h1>
      <button className={styles.startButton} onClick={closeModal}>開始</button>
    </div>
  );
};

export default GameStart;