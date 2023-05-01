import styles from "/styles/tcg/pc-show-modal.module.css";
import Image from "next/image";
import CardData from "card.json"

export default function PcShowModal(props){
  
  const iCard = CardData.find(card => card.no === props.insuranceCard);
  const iSrc = iCard ? iCard.src : 'base.png'
  const oCard = CardData.find(card => card.no === props.optionalCard);
  const oSrc = oCard ? oCard.src : 'base.png'

  const closeModal = () => {
    props.setPcShowModalShow(false);
    props.setTurnEndModalShow(true)
  };


  if (props.pcShowModalShow) {
    return (
      <div className={styles.overlay} onClick={closeModal}>
        <div className={`${styles.content} ${styles.slideFromTop}`} onClick={(e) => e.stopPropagation()}>
        
          <h2>保険カード</h2>
          <div className={styles.card}>
            <Image
              className={styles.cardImg}
              src={`/tcg/${iSrc}`}
              alt=""
              width={254}
              height={342}
              style={{
                width: "50%",
                height: "auto",
              }}
            />
          </div>
          
          <h2>特約カード</h2>
          <div className={styles.card}>
            <Image
              className={styles.cardImg}
              src={`/tcg/${oSrc}`}
              alt=""
              width={254}
              height={342}
              style={{
                width: "50%",
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
