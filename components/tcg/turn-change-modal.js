import styles from "/styles/tcg/turn-change-modal.module.css";
import Image from "next/image";
import { useEffect, useState } from 'react';

const TurnChange = (props) => {
  const logos = ['/tcg/turn1.png', '/tcg/turn2.png'];

  const closeModal = () => {
    //props.turnChangeHandle(true);

    //カードの提示
    if(!props.playerTurn) {
      props.setCardModalShow(true)
    }

    props.setTurnChangeModalShow(false);
  };

  if (props.turnChangeModalShow) {
    return (
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
        <img
          className={styles.logo}
          src={props.playerTurn ? logos[0] : logos[1]}
          alt="ロゴマーク"
        />
        </div>      
        <h1 className={styles.gameTitle}>{props.playerTurn ? 'あなた':'コンピューター'}のターンです</h1>
        <h3 className={styles.message}>{props.playerTurn ? 'コンピューターにイベントを提示しましょう':'保険と特約で対抗してください'}</h3>
        <button className={styles.startButton} onClick={closeModal}>確認</button>
      </div>
    );
  } else {
    return null
  }    
};

export default TurnChange;
