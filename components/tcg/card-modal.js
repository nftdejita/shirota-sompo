import styles from "/styles/tcg/card-modal.module.css";
import Image from "next/image";
import CardData from "card.json"

export default function CardModal(props) {

  const card = CardData.find(card => card.no === props.viewCardNo);
  const src = card ? card.src : 'base.png'

  const closeModal = () => {
    props.setCardModalShow(false);
  };

  let slideClass
  if (props.cardModalDirection == 'top') slideClass = styles.slideFromTop;
  if (props.cardModalDirection == 'bottom') slideClass = styles.slideFromBottom;
  if (props.cardModalDirection == 'left') slideClass = styles.slideFromLeft;
  if (props.cardModalDirection == 'right') slideClass = styles.slideFromRight;

  if (props.cardModalShow) {
    return (
      <div className={styles.overlay} onClick={closeModal}>
        <div className={`${styles.content} ${slideClass}`} onClick={(e) => e.stopPropagation()}>
          <h2>{props.cardModalTitle}</h2>
          <div className={styles.card}>
            <Image
              className={styles.cardImg}
              src={`/tcg/${src}`}
              alt=""
              width={254}
              height={342}
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>
          <button className={styles.cuteButton}  onClick={closeModal}>閉じる</button>
        </div>
      </div>
    );
  } else {
    return null
  }    
}
