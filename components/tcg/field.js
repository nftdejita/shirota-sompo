import { useEffect } from "react";
import styles from "/styles/tcg/field.module.css";
import Image from "next/image";
import CardData from "card.json"

export default function Field(props){

  const eCard = CardData.find(card => card.no === props.eventCard);
  const eSrc = eCard ? eCard.src : 'base.png'
  const iCard = CardData.find(card => card.no === props.insuranceCard);
  const iSrc = iCard ? iCard.src : 'base.png'
  const oCard = CardData.find(card => card.no === props.optionalCard);
  const oSrc = oCard ? oCard.src : 'base.png'

  useEffect(() => {
    if (eCard) {
      props.setTurnEnable(true);
    } else {
      props.setTurnEnable(false);
    }
  }, [eCard, props]);
  
  return (
    <div className={styles.container}>
      <div className={styles.attack} style={{ backgroundColor: props.playerTurn ? '': 'indigo'  }}>
        <Image
          className={styles.card} 
          onClick={(Slide, e) => {
            props.fieldClickHandle(props.eventCard,"event");
          }}
          src={`/tcg/${eSrc}`}
          alt=""
          width={254}
          height={342}
          style={{
            width: "60%",
            height: "auto",
          }}
        />
        <h4>イベント</h4>
      </div>
      <div className={styles.defense} style={{ backgroundColor:props.playerTurn ? 'indigo' : ''  }}>
      <div>
        <Image
          className={styles.card} 
          onClick={(Slide, e) => {
            props.fieldClickHandle(props.insuranceCard,"insurance");
          }}
          src={`/tcg/${iSrc}`}
          alt=""
          width={254}
          height={342}
          style={{
            width: "60%",
            height: "auto",
          }}
        /> 
        <h4>保険</h4>
      </div>
      <div>
        <Image
          className={styles.card} 
          onClick={(Slide, e) => {
            props.fieldClickHandle(props.optionalCard,"option");
          }}
          src={`/tcg/${oSrc}`}
          alt=""
          width={254}
          height={342}
          style={{
            width: "60%",
            height: "auto",
          }}
        />
        <h4>特約</h4>
      </div>
      </div>
    </div>
  );
}
