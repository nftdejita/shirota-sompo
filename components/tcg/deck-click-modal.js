import styles from "/styles/tcg/deck-click-modal.module.css";

export default function DeckClickModal(props) {

  const closeModalNo = () => {
    props.setDeckModalShow(false);
  };

  const closeModalYes = () => {
    props.playerGetOneCard(true);
    props.setDeckModalShow(false);
  };
  
  if (props.deckModalShow) {
    return (
      <div className={styles.overlay} onClick={closeModalNo}>
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>

          <div className={styles.messageBox}>
              <p>カードは有料ですがよろしいですか？</p>
              <div className={styles.buttons}>
                  <button onClick={closeModalYes} className={styles.yesButton}>はい</button>
                  <button onClick={closeModalNo} className={styles.noButton}>いいえ</button>
              </div>
          </div>

        </div>
      </div>
    );
  }
  else {
    return null
  }
}
