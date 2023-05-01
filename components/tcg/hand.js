import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/css"; // デフォルトのテーマを読み込んでいます（コアスタイルのみ読み込む設定も可能）
import styles from "/styles/tcg/hand.module.css";
import CardData from "card.json"
import Image from "next/image";

export default function Hand(props) {

  const name = props.isPc ? "コンピューター" : "あなた";
  const place = props.isPc ? "pcHand" : "hand";

  const handleClickDeck = () => {
    props.deckClickHandle(place)
  }

  const deckstyle = (!props.isPc && !props.drewDeck) ? "blinkCard" : "card"

  return (
    <div className={styles.flame}>
      <div className={styles.hand}>
        <Splide
          options={{
            perPage: 5,
            arrows: false,
            width: "100%",
            pagination: false,
            start: `${props.handCards.length}`,
          }}
        >
        {props.handCards &&
          props.handCards.map((cardNumber, index) => {
            let cardStyle = "cardDark";
            let cardOnStyle = "card"
            const card = CardData.find((card) => card.no === cardNumber);
        
            if (props.playerTurn) {
              if (card.type == "event") cardStyle = cardOnStyle;
            } else {
              const eCard = CardData.find((card) => card.no === props.eventCard);
              const eLine = eCard.line;
              if (card.type == "action" && eLine.includes(card.line))
                cardStyle = cardOnStyle;
        
              if (card.type == "option" && props.insuranceCard) {
                const iCard = CardData.find(
                  (card) => card.no === props.insuranceCard
                );
                const iLine = iCard.optionLine;
                if (iLine.includes(card.line)) cardStyle = cardOnStyle;
              }
            }
        
            if (props.isPc) cardStyle = "card";
            return (
              <SplideSlide
                onClick={(Slide, e) => {
                  props.handClickHandle(cardNumber, place);
                }}
                key={index}
              >
                <Image
                  className={styles[cardStyle]}
                  src={`/tcg/${
                    CardData.find((card) => card.no === cardNumber)
                      ? CardData.find((card) => card.no === cardNumber).src
                      : "base.png"
                  }`}
                  alt=""
                  width={254}
                  height={342}
                  style={{
                    width: "90%",
                    height: "auto",
                  }}
                />
              </SplideSlide>
            );
          })}
        </Splide>
        <h3 className={styles.title}>{`${name}の手札　${props.handCards && props.handCards.length}枚`}</h3>
      </div>
      <div className={styles.deck}>
        <Image
          className={styles[deckstyle]} 
          onClick={handleClickDeck}
          src={props.deck.length>0 ? "/tcg/back-face.png" : "/tcg/base.png"}
          alt=""
          width={254}
          height={342}
          style={{
            width: "80%",
            height: "auto",
          }}
        />
  
        <h3>{props.deck.length}枚{props.drewDeck}</h3>
      </div>
    </div>
  );
}
