import styles from "/styles/tcg/control.module.css";
import Image from "next/image";

export default function Control(props){
  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <div className={styles.status}>
          {props.playerStatus.map((status, index) => (
            <p key={`player-${index}`}>あなた：{status.label} 残り{status.remain}日</p>
          ))}
          {props.pcStatus.map((status, index) => (
            <p key={`computer-${index}`}>コンピュータ：{status.label} 残り {status.remain}日</p>
          ))}

          <h3>{props.playerPeriodTitle} {props.pcPeriodTitle}</h3>
          <p>{props.guideMessage}</p>
        </div>
        <div className={styles.side}>
          <Image
            onClick={(Slide, e) => {
              props.turnClickHandle();
            }}
            className={styles.cardImg}
            src={ props.turnEnable ? "/tcg/push_button-1.png":"/tcg/push_button-2.png"}
            alt=""
            width={500}
            height={500}
            style={{
              width: "80px",
              height: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
}
