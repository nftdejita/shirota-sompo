import styles from "/styles/tcg/field-click-modal.module.css";
import Image from "next/image";
import CardData from "card.json"

export default function FieldClickModal(props){
  
  const closeModal = () => {
    props.setFieldModalShow(false);
  };
  
  const takeField = () => {
    props.takeFieldHandl()
  }
  
  const card = CardData.find(card => card.no === props.viewCardNo);
  const src = card ? card.src : 'base.png'


  if (props.fieldModalShow) {
    return (
      <div className={styles.overlay} onClick={closeModal}>
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>

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
          {props.enableField && <button className={styles.cuteButton} onClick={takeField}>手札に戻す</button>}
          <button className={styles.cuteButton}  onClick={closeModal}>閉じる</button>
        </div>
      </div>
    );
  } else {
    return null
  }    
}
