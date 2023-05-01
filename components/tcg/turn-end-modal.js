import styles from "/styles/tcg/turn-end-modal.module.css";
import CardData from "card.json"
import Dice from "/components/tcg/dice"
import React, { useState, useEffect } from "react";

export default function PcTurnEndModal(props) {

  const numPlate = 8;
  // plate 0:現在合計 1:現在状態　2:イベント 3:サイコロ 4:保険　5:特約　6:追加状態 7:総合計
  const defaultDelays = [1000, 1000, 1000, 1000, 3000, 1000, 1000, 1000];
  const [showPlates, setShowPlates] = useState(Array(numPlate).fill(false));
  const [visiblePlate, setVisiblePlate] = useState(Array(numPlate).fill(false));

  // 現在の状態取得
  const pState = props.playerTurn ? props.pcStatus : props.playerStatus
  
  const passStateLoss = pState.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.loss;
  }, 0);

  const passStateGain = pState.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.gain;
  }, 0);

  // イベントカードの情報
  const eCard = CardData.find(card => card.no === props.eventCard);
  const eName = eCard ? eCard.name : "指定ありません";
  const eLoss = eCard ? eCard.loss : 0;
  const eDesc = eCard ? eCard.desc : "";

  // ダイスの設定
  const dDeff = eCard ? eCard.isDice : false
  const dType = eCard ? eCard.diceType : ""
  const dDesc = eCard ? eCard.diceDesc : ""
  
  // 保険カードの情報
  const iCard = CardData.find(card => card.no === props.insuranceCard);
  const iName = iCard ? iCard.name : "指定ありません";
  const iLoss = iCard ? iCard.loss : 0;
  const iDesc = iCard ? iCard.desc : "";

  // 特約カードの情報
  const oCard = CardData.find(card => card.no === props.optionalCard);
  const oName = oCard ? oCard.name : "指定ありません";
  const oLoss = oCard ? oCard.loss : 0;
  const oDesc = oCard ? oCard.desc : "";

  let dLoss = 0
  let optionGain = 0
  
  if (eCard && eCard.isDice && eCard.diceType == "period") {
    dLoss = eCard.statusEffect
    optionGain = iCard ? iCard.optionGain : 0;
    if (oCard) optionGain += oCard.optionGain
  }
  
  let aLoss = 0
  if (eCard && eCard.isDice && eCard.diceType == "scale") {
    aLoss = eCard.statusEffect * props.diceNo
  }
  
  const playerBill = !props.playerTurn && iLoss + oLoss - eLoss + optionGain - dLoss + passStateGain - passStateLoss -aLoss
  const pcBill = props.playerTurn && iLoss + oLoss - eLoss + optionGain - dLoss + passStateGain - passStateLoss -aLoss
  //console.log(iLoss,oLoss,eLoss,optionGain,dLoss,passStateGain,passStateLoss,aLoss)

  // 既存状態の更新（期限切れは削除)
  const decrementRemainAndRemove = (array) => {
    return array
      .map((obj) => ({ ...obj, remain: obj.remain - 1 })) // 各要素のageをデクリメント
      .filter((obj) => obj.remain !== 0); // ageが0でない要素だけを残す
  };
  let pNewState = decrementRemainAndRemove(pState);

  // 新状態のセット
  if (dDeff && dType == "period") {
    const newState = { label: eCard.statusTitle, remain: props.diceNo, loss: eCard.statusEffect, gain: optionGain }
    pNewState = (prevArray) => [...prevArray, newState];
  }

  useEffect(() => {
    const timers = [];

    const showPlateWithDelay = (index, delay) => {
      if (index >= numPlate) return;

      if (visiblePlate[index]) {
        timers[index] = setTimeout(() => {
          setShowPlates((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
          showPlateWithDelay(index + 1, defaultDelays[index + 1]);
        }, delay);
      }
      else {
        showPlateWithDelay(index + 1, 0);
      }
    };

    showPlateWithDelay(0, defaultDelays[0]);

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [visiblePlate]);

  useEffect(() => {
    const updateViewPlate = () => {
      // plate 0:現在合計 1:現在状態　2:イベント 3:サイコロ 4:保険　5:特約　6:追加状態 7:総合計
      let newViewPlate = [true, false, true, false, false, false, false, true];

      if (pState.length>0) newViewPlate[1] = true;
      if (eCard && eCard.isDice) newViewPlate[3] = true;
      if (iCard) newViewPlate[4] = true;
      if (oCard) newViewPlate[5] = true;
      if (eCard && eCard.isDice) newViewPlate[6] = true;

      setVisiblePlate(newViewPlate);
      //diceNo = Math.floor(Math.random() * 6) + 1;
    };

    updateViewPlate();
    setShowPlates(Array(numPlate).fill(false))
  }, [props.turnEndModalShow]);

  // ボタンを押したときの処理
  const closeModal = () => {
    
    if (props.pcBallance+pcBill <=0 || props.playerBallance+playerBill<=0) {
      props.setPlayerBallance((pre_ballance)=>pre_ballance+playerBill)
      props.setPcBallance((pre_ballance)=>pre_ballance+pcBill)
      props.setOfScene(()=>2) // GameOver
    } else {
      props.turnChangeHandle(playerBill, pcBill)
  
      const pcNewState = decrementRemainAndRemove(props.pcStatus);
      // 新状態のセット
      if (props.playerTurn && eCard && eCard.isDice && eCard.diceType == "period") {
        const newState = { label: eCard.statusTitle, remain: props.diceNo, loss: dLoss, gain: optionGain }
        props.setPcStatus([...pcNewState, newState])
      } else {
        props.setPcStatus(pcNewState)
      }
  
      const playerNewState = decrementRemainAndRemove(props.playerStatus);
      // 新状態のセット
      if (!props.playerTurn && eCard && eCard.isDice && eCard.diceType == "period") {
        const newState = { label: eCard.statusTitle, remain: props.diceNo, loss: dLoss, gain: optionGain }
        props.setPlayerStatus([...playerNewState, newState])
      } else {
        props.setPlayerStatus(playerNewState)
      }
  
      setVisiblePlate(Array(numPlate).fill(false))
    }
    props.setTurnEndModalShow(false);

  };

  if (props.turnEndModalShow) {
    return (
      <div className={styles.overlay} onClick={closeModal}>
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {props.playerTurn && <h2>清算：コンピューター</h2>}
        {!props.playerTurn && <h2>清算：あなた</h2>}

        {showPlates[0] && 
        <div className={styles.frameA}>
          <div className={styles.title}>
            <h3>残高</h3>
            <h3>{props.playerTurn ? props.pcBallance :props.playerBallance} G</h3>
          </div>
        </div>
        }

        {showPlates[1] && 
        <div className={styles.frameA}>
          <div className={styles.title}>
            <h3>現在の状態</h3>
          </div>
          <hr />
          {pState.map((status, index) => {
            return (
              <div className={styles.title} key={index}>
                <p>{status.label} 残り {status.remain}</p>
                <p>(-{status.loss}+{status.gain})　{status.gain - status.loss}</p>
              </div>
            );
          })}

        </div>
        }

        {showPlates[2] && 
        <div className={styles.frameB}>
          <div className={styles.title}>
              <h3>イベント</h3>
              <h3>{eName}    -{eLoss}G</h3>
          </div>
          <hr />
          <p>{eDesc}</p>
        </div>
        }
        
        {showPlates[3] && 
        <div>
          <div className={styles.frame}>
            <Dice num={props.diceNo}/>
          </div>
        </div>
        }

        {showPlates[4] && 
        <div className={styles.frameB}>
          <div className={styles.title}>
              <h3>保険</h3>
              <h3>{iName}    +{iLoss}G</h3>
          </div>
          <hr />
          <p>{iDesc}</p>
        </div>
        }

        {showPlates[5] && 
        <div className={styles.frameB}>
          <div className={styles.title}>
              <h3>特約</h3>
              <h3>{oName}    +{oLoss}G</h3>
          </div>
          <hr />
          <p>{oDesc}</p>
        </div>
         }

        {showPlates[6] && 
        <div className={styles.frameA}>
          {(eCard.diceType == "period") &&
          <>
            <div className={styles.title}>
              <h3>{eCard.statusTitle} {props.diceNo}日</h3>
              <h3>(-{dLoss}+{optionGain})　{optionGain - dLoss}</h3>
            </div>
            <hr />
            <p>{eCard.diceDesc}</p>
          </>
          }
          {(eCard.diceType == "scale") &&
          <>
            <div className={styles.title}>
              <h3>追加ダメージ</h3>
              <h3>{props.diceNo}×{eCard.statusEffect}G　-{aLoss}</h3>
            </div>
            <hr />
            <p>{eCard.diceDesc}</p>
          </>
          }
        </div>
        }

        {showPlates[7] && 
         <>
          <div className={styles.frameA}>
            <div className={styles.title}>
              <h3>合計</h3>
              <h3>{props.playerTurn ? pcBill :playerBill} G</h3>
            </div>
            <hr/>
            <div className={styles.title}>
              <h3>今回残高</h3>
              <h2>{props.playerTurn ? props.pcBallance+pcBill :props.playerBallance+playerBill} G</h2>
            </div>
          </div>
          <button className={styles.cuteButton} onClick={closeModal}>次へ</button>
        </>
         }
        </div>
      </div>
    );
  }
  else {
    return null
  }
}
