import styles from "/styles/tcg/game-over.module.css";
import React, { useEffect, useState } from 'react';

const GameOver = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const classNameTimeout = 1500;
    const pauseTimeout = 5000;

    // 最初のアニメーションを即座に開始
    setIsVisible(true);
    let timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, classNameTimeout + pauseTimeout);

    const intervalId = setInterval(() => {
      setIsVisible(true);
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, classNameTimeout + pauseTimeout);
    }, classNameTimeout * 2 + pauseTimeout);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const closeModal = () => {
    window.location.reload()
  };

  return (
    <div className={styles.container}>
      { props.playerBallance < props.pcBallance && <h1> 負けました </h1>}
      { props.playerBallance >= props.pcBallance && <h1> 勝ちました </h1>}
      <h1>あなたの残高 {props.playerBallance}G</h1>
      <h1>コンピューターの残高 {props.pcBallance}G</h1>
      <h2>　</h2>
      <h1 className={`${styles.title} ${isVisible ? styles.visible : ""}`}>
      { props.playerBallance < props.pcBallance && 
      <>
        <span>G</span>
        <span>A</span>
        <span>M</span>
        <span>E</span>
        <span>&nbsp;</span>
        <span>O</span>
        <span>V</span>
        <span>E</span>
        <span>R</span>
      </>
      }
      { props.playerBallance >= props.pcBallance && 
      <>
        <span>C</span>
        <span>o</span>
        <span>n</span>
        <span>g</span>
        <span>r</span>
        <span>a</span>
        <span>t</span>
        <span>u</span>
        <span>l</span>
        <span>a</span>
        <span>t</span>
        <span>i</span>
        <span>o</span>
        <span>n</span>

      </>
      }
      </h1>
      <button className={styles.returnButton} onClick={closeModal}>戻る</button>
      
      { props.playerBallance >= props.pcBallance && 

    	  <div className={styles.confetti}>
      	  <span></span><span></span><span></span><span></span>
      		<span></span><span></span><span></span><span></span><span></span>
      		<span></span><span></span><span></span><span></span><span></span>
      		<span></span><span></span><span></span><span></span><span></span>
      		<span></span><span></span><span></span><span></span><span></span>
      		<span></span><span></span><span></span><span></span><span></span>
      		<span></span><span></span><span></span><span></span><span></span>
      		<span></span><span></span><span></span><span></span><span></span>
      		<span></span><span></span><span></span><span></span><span></span>
      		<span></span><span></span><span></span><span></span><span></span>
        </div>
      }
      
    </div>
  );
};

export default GameOver;
