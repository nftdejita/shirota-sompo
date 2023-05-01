import styles from "/styles/tcg/score.module.css";

export default function Score(props) {
  return (
    <div className={styles.flame}>
      <div className={styles.spaceBetween}>
        <p>あなた {props.playerBallance} G</p>
        <p>コンピューター {props.pcBallance} G</p>
      </div>
    </div>
  );
}
