import React, { useRef,useEffect  } from "react";
import styles from "/styles/tcg/dice.module.css";

const Dice = (props) => {
  const diceRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (diceRef.current) {
      switch (props.num) {
        case 1:
          diceRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
          break;

        case 6:
          diceRef.current.style.transform = "rotateX(180deg) rotateY(0deg)";
          break;

        case 2:
          diceRef.current.style.transform = "rotateX(-90deg) rotateY(0deg)";
          break;

        case 5:
          diceRef.current.style.transform = "rotateX(90deg) rotateY(0deg)";
          break;

        case 3:
          diceRef.current.style.transform = "rotateX(0deg) rotateY(90deg)";
          break;

        case 4:
          diceRef.current.style.transform = "rotateX(0deg) rotateY(-90deg)";
          break;

        default:
          break;
      }
      }
    }, 2050);
  },[props.num]);

  return (
    <div className={styles.container}>
      <div className={styles.dice} ref={diceRef}>
        <div className={`${styles.face} ${styles.front}`}></div>
        <div className={`${styles.face} ${styles.back}`}></div>
        <div className={`${styles.face} ${styles.top}`}></div>
        <div className={`${styles.face} ${styles.bottom}`}></div>
        <div className={`${styles.face} ${styles.right}`}></div>
        <div className={`${styles.face} ${styles.left}`}></div>
      </div>
    </div>
  );
};

export default Dice;
