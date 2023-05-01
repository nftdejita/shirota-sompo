import { useState, useEffect } from "react";
import Container from "/components/container";
import Score from "/components/tcg/score";
import Field from "/components/tcg/field";
import Control from "/components/tcg/control";
import Hand from "/components/tcg/hand";
import Logs from "/components/tcg/logs";
import GameStart from "/components/tcg/game-start";
import GameOver from "/components/tcg/game-over";
import CardModal from "/components/tcg/card-modal";
import HandClickModal from "/components/tcg/hand-click-modal";
import DeckClickModal from "/components/tcg/deck-click-modal";
import FieldClickModal from "/components/tcg/field-click-modal";
import PcShowModal from "/components/tcg/pc-show-modal";
import TurnEndModal from "/components/tcg/turn-end-modal";
import CardData from "card.json"
import DeckSet1 from "deck-set-1.json"
import TurnChangeModal from "/components/tcg/turn-change-modal";



export default function Home() {
  const [playerBallance, setPlayerBallance] = useState(1000); // プレイヤーの残金
  const [pcBallance, setPcBallance] = useState(1000); // PCの残金
  const [playerTurn, setPlayerTurn] = useState(true); // プレイヤーのターンならtrue

  const [eventCard, setEventCard] = useState(null); // 場に置かれているイベントのカード番号、nullなら置かれていない
  const [insuranceCard, setInsuranceCard] = useState(null); // 場に置かれている保険のカード番号、nullなら置かれていない
  const [optionalCard, setOptionalCard] = useState(null); // 場に置かれている特約のカード番号、nullなら置かれていない

  const [logMessages, setLogMessages] = useState([]); // メッセージ群
  const [guideMessage, setGuideMessage] = useState(""); // 次に可能な操作の指示  
  const [turnEnable, setTurnEnable] = useState(false); // ターンボタンを押せるかどうか

  // 山札（DeckSet1をシャッフルしたもの）ゼロ番目に一番上のカードの番号が入っている
  const [playerDeck, setPlayerDeck] = useState(shuffle([...DeckSet1.deck]));
  const [pcDeck, setPcDeck] = useState(shuffle([...DeckSet1.deck]));

  // 手札（初回はDeckから５枚持ってくる）
  const [playerHandCards, setPlayerHandCards] = useState();
  const [pcHandCards, setPcHandCards] = useState();

  const [ofScene, setOfScene] = useState(0); // 画面全体の構成(0:初期画面　1:ゲーム画面　2:終了画面 3:ターン切り替え画面)
  

  // モーダルの表示可否を決める
  const [handModalShow, setHandModalShow] = useState(false)
  const [deckModalShow, setDeckModalShow] = useState(false)
  const [fieldModalShow, setFieldModalShow] = useState(false)
  const [pcShowModalShow, setPcShowModalShow] = useState(false)
  const [turnEndModalShow, setTurnEndModalShow] = useState(false)
  const [cardModalShow, setCardModalShow] = useState(false)
  const [cardModalTitle, setCardModalTitle] = useState("")
  const [cardModalDirection, setCardModalDirection] = useState("")
  const [turnChangeModalShow, setTurnChangeModalShow] = useState(false)
  
  // モーダルに表示するカード番号（共有している）
  const [viewCardNo, setViewCardNo] = useState(0);

  // 場に出してよいかのフラグ
  const [enableField, setEnableField] = useState(false)


  const [drewDeck, setDrewDeck] = useState(false); // 山札から取得したかどうか

  // 入院中などの継続状態に関するステート変数
  const [playerStatus, setPlayerStatus] = useState([]); // プレイヤーの状態表示
  const [pcStatus, setPcStatus] = useState([]); // PCの状態表示

  const [diceNo, setDiceNo] = useState(1)
  

  // -----------------------------------------
  // ゲームの開始処理
  // -----------------------------------------
  const gemeStartHandle = () => {

    // Deckから５枚取得する
    setPlayerHandCards(playerDeck.slice(0, 5));
    setPlayerDeck(playerDeck.slice(5));

    const playerFirst = Math.random() >= 0.5
    setPlayerTurn(playerFirst); // ランダムに先攻後攻を決める

    // PCが先攻する場合
    if (!playerFirst) {
      // 山札から6枚引く
      let _pcHand = pcDeck.slice(0, 6)
      let _pcDeck = pcDeck.slice(6)

      let cardIndex = []


      // イベントカードを発見した
      if (setEventByPc(_pcDeck, _pcHand, cardIndex)) {
        //カードの提示
        setCardModalTitle("イベントが提示されました")
        setViewCardNo(_pcHand[cardIndex[0]])
        setCardModalDirection("top")
        //setCardModalShow(true)
        setTurnChangeModalShow(true);

        setEventCard(_pcHand[cardIndex[0]]);
        const cardName = CardData.find((card) => card.no === _pcHand[cardIndex[0]]).name
        _pcHand.splice(cardIndex[0], 1);
        setLogMessages((pre_logs) => [...pre_logs, `コンピューターが${cardName}を場に出しました`])

        setPcHandCards(_pcHand);
        setPcDeck(_pcDeck);

        setGuideMessage(()=> "山札をクリックして手札から保険を選んでください")

      }
      else {
        setOfScene(2) // GameOver
      }
    }
    // プレイヤーが先攻する場合
    else {
      // 山札から5枚引く
      setPcHandCards(pcDeck.slice(0, 6));
      setPcDeck(pcDeck.slice(6));
      setTurnChangeModalShow(()=>true);
      setGuideMessage(()=> "山札をクリックしてイベントを選んでください")
    }

    setOfScene(1);
  };

  // -----------------------------------------
  // PC側の手札からイベントカードを出す
  // -----------------------------------------
  const setEventByPc = (_pcDeck, _pcHand, cardIndex) => {

    while (choseCard("event", _pcDeck, _pcHand, cardIndex)) {

      if (_pcDeck.length == 0) break; // カードがなくなれば終わり

      // カードを山札からもってくる
      const card = CardData.find((card) => card.no === _pcDeck[0])
      setPcBallance((pre_ballance) => pre_ballance - card.price);
      setLogMessages((pre_logs) => [...pre_logs, `コンピューターが${card.price}Gで山札からカードを引きました`])

      _pcHand.push(_pcDeck[0]); // 無ければ山札から一枚持ってくる
      _pcDeck.splice(0, 1); // 山札を減らす

    }

    return cardIndex.length > 0
  }


  // -----------------------------------------
  // 手札を検索してほしいカードを取り出す
  // -----------------------------------------
  const choseCard = (_target, _pcDeck, _pcHand, cardIndex, _insuCard = null) => {

    let maxLoss = 0;

    if (_pcHand.length == 0) return true

    _pcHand.forEach((cardNo, index) => {
      // カード情報を検索する
      const targetCard = CardData.find((card) => card.no === cardNo);

      if (targetCard && targetCard.type === _target) {

        let goFlag = false

        if (targetCard.type === "event") {
          goFlag = true
        }

        // 保険は種目が合っている時に出せる
        if (targetCard.type === "action") {
          // イベントカードを取得する
          const eCard = CardData.find(card => card.no === eventCard)
          const eLine = eCard.line
          // 保険種目がイベントと合っていればカードを出せる
          if (targetCard.type == "action" && eLine.includes(targetCard.line)) goFlag = true;
        }

        // 特約は保険が場に出ている時だけ出せる
        if (targetCard.type == "option" && _insuCard) {
          const iCard = CardData.find(card => card.no === _insuCard)
          const iLine = iCard.optionLine
          // 特約コードが保険に設定されていれば特約カードを出せる
          if (iLine.includes(targetCard.line)) goFlag = true;
        }

        // 手札からLossが最大となるカードを検索する
        if (goFlag && maxLoss < targetCard.loss) {
          maxLoss = targetCard.loss;
          cardIndex.push(index);
        }
      }
    });

    return !(cardIndex.length > 0)
  }

  // -----------------------------------------
  // 手札をクリックした時
  // -----------------------------------------
  const handClickHandle = (cardNo, place) => {
    // place pcHand hand
    // 自分の番ならイベントカードが出せる。相手のターンなら保険と特約が出せる
    const card = CardData.find(card => card.no === cardNo)

    setEnableField(false); // まず「場に出すボタン」を非表示にする
    if (place == 'hand') {
      if (playerTurn) {
        // 自分の攻撃の場合はイベントカードを出せる
        if (card.type == "event") setEnableField(true);
      }
      else {
        // 自分が守備側なら、相手のEventカードの内容で判断する
        const eCard = CardData.find(card => card.no === eventCard)
        const eLine = eCard.line
        // 保険種目がイベントと合っていればカードを出せる
        if (card.type == "action" && eLine.includes(card.line)) setEnableField(true);

        // 特約は保険が場に出ている時だけ出せる
        if (card.type == "option" && insuranceCard) {
          const iCard = CardData.find(card => card.no === insuranceCard)
          const iLine = iCard.optionLine
          // 特約コードが保険に設定されていれば特約カードを出せる
          if (iLine.includes(card.line)) setEnableField(true);
        }
      }
    }

    setViewCardNo(cardNo);
    setHandModalShow(true);

  };

  // -----------------------------------------
  // 場にカードを出す  
  // -----------------------------------------
  const putFieldHandle = () => {

    const card = CardData.find(card => card.no === viewCardNo)

    const backup = eventCard;

    if (card.type == "event") {
      if (eventCard) playerHandCards.push(eventCard);
      setEventCard(viewCardNo);
      setGuideMessage(()=> "赤いボタンを押してターンを切り替えてください")

    }
    if (card.type == "action") {
      if (insuranceCard) playerHandCards.push(insuranceCard);
      setInsuranceCard(viewCardNo);
      if (optionalCard) {
        playerHandCards.push(optionalCard);
        setOptionalCard(null);
      }
      setGuideMessage(()=> "特約をつけるか、ターンを変更できます")

    }
    if (card.type == "option") {
      if (optionalCard) playerHandCards.push(optionalCard);
      setOptionalCard(viewCardNo);
      setGuideMessage(()=> "赤いボタンを押してターンを切り替えてください")
    }

    setLogMessages((pre_logs) => [...pre_logs, `${card.name}を場に出しました`])
    const indexToRemove = playerHandCards.findIndex((element) => element === viewCardNo);
    playerHandCards.splice(indexToRemove, 1);

    setHandModalShow(false);

  }


  // -----------------------------------------
  // 山札をクリックした時
  // -----------------------------------------
  const deckClickHandle = (place) => {
    if (place == "hand" && playerDeck.length > 0) {
      if (drewDeck) {
        setDeckModalShow(true);
      }
      else {
        playerGetOneCard(false);
      }
    }
  };

  // -----------------------------------------
  // プレイヤーの山札から１枚手札に加える
  // -----------------------------------------
  const playerGetOneCard = (billing) => {

    if (billing) {
      // 山札の情報を取得
      const card = CardData.find(card => card.no === playerDeck[0])
      setPlayerBallance((pre_ballance) => pre_ballance - card.price);
      setLogMessages((pre_logs) => [...pre_logs, `${card.price}Gで山札からカードを引きました`])
    }

    setCardModalTitle("山札からカードを引きました")
    setCardModalDirection("right")
    setViewCardNo(playerDeck[0])
    setCardModalShow(true)

    playerHandCards.push(playerDeck[0]);
    playerDeck.splice(0, 1);
    setDrewDeck(true);
  }

  // -----------------------------------------
  // 場をクリックした時
  // -----------------------------------------
  const fieldClickHandle = (cardNo, clickPlace) => {
    // clickPlace :  event insurance option hand pcHand

    setEnableField(false); // まず「手札に戻すボタン」を非表示にする
    if (playerTurn && clickPlace == "event") setEnableField(true);
    if (!playerTurn && clickPlace == "insurance") setEnableField(true);
    if (!playerTurn && clickPlace == "option") setEnableField(true);


    setViewCardNo(cardNo);
    if (cardNo) setFieldModalShow(true);
  };

  // -----------------------------------------
  // 場のカードを手札に戻す 
  // -----------------------------------------
  const takeFieldHandl = () => {

    const card = CardData.find(card => card.no === viewCardNo)

    if (card.type == "event") {
      setEventCard(null);
      setGuideMessage(()=> "イベントを提示してください")
    }
    if (card.type == "action") {
      setInsuranceCard(null);
      if (optionalCard) {
        playerHandCards.push(optionalCard);
        setOptionalCard(null);
      }
      setGuideMessage(()=> "保険を選んでください")
    }
    if (card.type == "option") setOptionalCard(null);

    playerHandCards.push(viewCardNo);

    setFieldModalShow(false);

  }


  // -----------------------------------------
  // ターンボタンをクリックした時
  // -----------------------------------------
  const turnClickHandle = () => {
    setDiceNo(Math.floor(Math.random() * 6) + 1)
    if (turnEnable) playerTurn ? setFieldCardByPc() : setTurnEndModalShow(true);
  };

  // -----------------------------------------
  // PC側の守備
  // -----------------------------------------
  const setFieldCardByPc = () => {

    let _pcHand = pcHandCards
    let _pcDeck = pcDeck
    let cardIndex = []
    let _insuCard

    if (setInsuranceByPc(_pcDeck, _pcHand, cardIndex)) {
      setInsuranceCard(_pcHand[cardIndex[0]]);
      _insuCard = _pcHand[cardIndex[0]]
      const cardName = CardData.find((card) => card.no === _pcHand[cardIndex[0]]).name
      _pcHand.splice(cardIndex[0], 1);
      setLogMessages((pre_logs) => [...pre_logs, `コンピューターが${cardName}を場に出しました`])
    }
    else {
      _insuCard = null
      setLogMessages((pre_logs) => [...pre_logs, `コンピューターは保険カードを出せませんでした`])
    }

    cardIndex = []
    if (seOptionByPc(_pcDeck, _pcHand, cardIndex, _insuCard)) {
      setOptionalCard(_pcHand[cardIndex[0]]);
      const cardName = CardData.find((card) => card.no === _pcHand[cardIndex[0]]).name
      _pcHand.splice(cardIndex[0], 1);
      setLogMessages((pre_logs) => [...pre_logs, `コンピューターが${cardName}を場に出しました`])
    }
    else {
      setLogMessages((pre_logs) => [...pre_logs, `コンピューターは特約カードを出せませんでした`])
    }

    setPcHandCards(_pcHand);
    setPcDeck(_pcDeck);
    setPcShowModalShow(true)
  }

  // -----------------------------------------
  // PCが保険カードを選ぶ
  // -----------------------------------------
  const setInsuranceByPc = (_pcDeck, _pcHand, cardIndex) => {

    while (choseCard("action", _pcDeck, _pcHand, cardIndex)) {

      if (_pcDeck.length == 0) break; // カードがなくなれば終わり

      // カードを山札からもってくる
      const card = CardData.find((card) => card.no === _pcDeck[0])
      setPcBallance((pre_ballance) => pre_ballance - card.price);
      setLogMessages((pre_logs) => [...pre_logs, `コンピューターが${card.price}Gで山札からカードを引きました`])

      _pcHand.push(_pcDeck[0]); // 無ければ山札から一枚持ってくる
      _pcDeck.splice(0, 1); // 山札を減らす

    }

    return cardIndex.length > 0
  }


  // -----------------------------------------
  // PCが特約カードを選ぶ
  // -----------------------------------------
  const seOptionByPc = (_pcDeck, _pcHand, cardIndex, _insuCard) => {

    while (choseCard("option", _pcDeck, _pcHand, cardIndex, _insuCard)) {

      if (_pcDeck.length == 0) break; // カードがなくなれば終わり

      // カードを山札からもってくる
      const card = CardData.find((card) => card.no === _pcDeck[0])
      setPcBallance((pre_ballance) => pre_ballance - card.price);
      setLogMessages((pre_logs) => [...pre_logs, `コンピューターが${card.price}Gで山札からカードを引きました`])

      _pcHand.push(_pcDeck[0]); // 無ければ山札から一枚持ってくる
      _pcDeck.splice(0, 1); // 山札を減らす

    }

    return cardIndex.length > 0
  }


  // -----------------------------------------
  // ターン変更
  // -----------------------------------------
  const turnChangeHandle = (playerBill, pcBill) => {
    playerBill && setPlayerBallance((pre_ballance) => pre_ballance + playerBill);
    pcBill && setPcBallance((pre_ballance) => pre_ballance + pcBill);


    
    // 場のカードを初期化する
    setEventCard(null);
    setInsuranceCard(null);
    setOptionalCard(null);
    // 山札取得済みフラグをクリアする
    setDrewDeck(false);


    if (playerTurn) {
      // 次はPC側がEventカードを出す
      let _pcHand = pcHandCards
      let _pcDeck = pcDeck
      let cardIndex = []

      if (_pcDeck.length > 0) {
        _pcHand.push(_pcDeck[0]);
        _pcDeck.splice(0, 1);
      }


      // イベントカードを出す
      if (setEventByPc(_pcDeck, _pcHand, cardIndex)) {
        setCardModalTitle("イベントが提示されました")
        setViewCardNo(_pcHand[cardIndex[0]])
        setCardModalDirection("top")
        //setCardModalShow(true)
        setTurnChangeModalShow(true);
        
        setEventCard(_pcHand[cardIndex[0]]);
        const cardName = CardData.find((card) => card.no === _pcHand[cardIndex[0]]).name
        _pcHand.splice(cardIndex[0], 1);
        setLogMessages((pre_logs) => [...pre_logs, `コンピューターが${cardName}を場に出しました`])

        setPcHandCards(_pcHand);
        setPcDeck(_pcDeck);
        setGuideMessage(()=> "山札をクリックして手札から保険を選んでください")
      }
      else {
        setOfScene(2) // GameOver
      }
    }
    else {
      // 次はプレイヤーがEventを出す
      setTurnChangeModalShow(()=>true);
      setGuideMessage(()=> "山札をクリックしてイベントを選んでください")

    }
    setPlayerTurn((pre_turn) => !playerTurn);
  }

  return (
    <>
    <Container>
      <article>
        {ofScene==0 && <GameStart gemeStartHandle={gemeStartHandle} />}
        {ofScene==1 && (
          <>
            <h1>保険カードバトル</h1>
            <Score playerBallance={playerBallance} pcBallance={pcBallance}/>
            <Hand
              isPc = {true}
              handCards = {pcHandCards}
              deck = {pcDeck}
              handClickHandle = {handClickHandle}
              deckClickHandle = {deckClickHandle}
              playerTurn={playerTurn}
              eventCard={eventCard}
              insuranceCard={insuranceCard}
            />
            <Field 
              playerTurn={playerTurn}
              eventCard={eventCard}
              insuranceCard={insuranceCard}
              optionalCard={optionalCard}
              fieldClickHandle ={fieldClickHandle}
              setTurnEnable={setTurnEnable}
            />
            <Control
              playerStatus = {playerStatus}
              pcStatus = {pcStatus}
              guideMessage = {guideMessage}
              turnClickHandle = {turnClickHandle}
              turnEnable = {turnEnable}
            />
            <Hand
              handCards = {playerHandCards}
              deck = {playerDeck}
              handClickHandle = {handClickHandle}
              deckClickHandle = {deckClickHandle}
              drewDeck = {drewDeck}
              playerTurn={playerTurn}
              eventCard={eventCard}
              insuranceCard={insuranceCard}
            />
            <Logs logMessages={logMessages} />
          </>
        )}

        {ofScene==2 && 
          <GameOver 
            setOfScene={setOfScene} 
            playerBallance = {playerBallance}
            pcBallance = {pcBallance}
          />
        }

        <TurnChangeModal 
          playerTurn={playerTurn}
          turnChangeModalShow={turnChangeModalShow}
          setTurnChangeModalShow={setTurnChangeModalShow}
          turnChangeHandle={turnChangeHandle}
          setCardModalShow = {setCardModalShow}
        />

        <HandClickModal handModalShow={handModalShow} setHandModalShow={setHandModalShow} 
          viewCardNo={viewCardNo} 
          enableField={enableField}
          putFieldHandle={putFieldHandle}
        />
        <DeckClickModal deckModalShow={deckModalShow} setDeckModalShow={setDeckModalShow}
          playerGetOneCard = {playerGetOneCard}
          setPlayerBallance = {setPlayerBallance}
        />
        <FieldClickModal fieldModalShow={fieldModalShow} setFieldModalShow={setFieldModalShow} 
          viewCardNo={viewCardNo} 
          enableField={enableField}
          takeFieldHandl={takeFieldHandl}
        />
        <CardModal cardModalShow = {cardModalShow} setCardModalShow={setCardModalShow} 
          viewCardNo={viewCardNo} 
          cardModalTitle={cardModalTitle}
          cardModalDirection={cardModalDirection}
        />
        <PcShowModal pcShowModalShow={pcShowModalShow} setPcShowModalShow={setPcShowModalShow} 
          insuranceCard = {insuranceCard}
          optionalCard = {optionalCard}
          setTurnEndModalShow = {setTurnEndModalShow}
        />
        <TurnEndModal turnEndModalShow={turnEndModalShow} setTurnEndModalShow={setTurnEndModalShow} 
          diceNo = {diceNo}
          playerTurn={playerTurn}
          eventCard={eventCard}
          insuranceCard={insuranceCard}
          optionalCard={optionalCard}
          setPlayerBallance = {setPlayerBallance}
          setPcBallance = {setPcBallance}
          turnChangeHandle = {turnChangeHandle}
          setOfScene={setOfScene}

          playerStatus = {playerStatus}  setPlayerStatus={setPlayerStatus}
          pcStatus = {pcStatus}  setPcStatus={setPcStatus}

          playerBallance = {playerBallance}
          pcBallance     = {pcBallance}

        />
      </article>
    </Container>
    </>
  )
}


function shuffle(array) {
  // フィッシャー–イェーツシャッフル
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
