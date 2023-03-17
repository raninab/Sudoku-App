import { View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header_Component } from "./Header_Component";
import { Actions_Component } from "./Actions_Component";
import { Grid } from "./Grid";
import { styles } from "./Styles";
import { Pieces_Component } from "./Pieces_Component";
import Lives from "./Lives";
import { GameOver_Component } from "./GameOver_Component";
import { Success_Component } from "./Success_Component";
import { HintsModal } from "./HintsModal";
import { useState, useEffect, useRef } from "react";
import { funcs } from "./gameLogic2";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import { GameContext } from "./GameContext";

var tileSound = null;
const Game_Board_View = (props = { navigation }) => {
  //Initial State (Passed from Home Page)
  const livesMappings = {
    I: 1,
    II: 2,
    III: 3,
    1: "I",
    2: "II",
    3: "III",
  };

  const {
    difficulty,
    lives,
    gameMode,
    colorTheme,
    unsolvedBoard,
    solvedBoard,
    soundState,
    initialTime,
  } = props.route.params;
  const initialLife = lives.split(" ")[1];
  const level = difficulty;
  const tileTheme = colorTheme.tileColor;
  const backColor = colorTheme.backgroundColor;
  const clockMode = gameMode === "CLASSIC" ? false : true;
  const isLifeMode = livesMappings[initialLife] ? true : false;
  const [life, setLife] = useState(livesMappings[initialLife]);
  //Game Config
  const [number, setNumber] = useState();
  const [board, setBoard] = useState(unsolvedBoard);
  const [solution, setSolution] = useState(solvedBoard);
  const [target, setTarget] = useState(undefined);
  const prevMistakes = props.route.params.mistakes || {};
  const [mistakes, setMistakes] = useState(prevMistakes); //get this from params
  const prevMoves = props.route.params.moves || [];
  const [moves, setMoves] = useState(prevMoves);
  const [endModal, setEndModal] = useState(false);
  const [hintsModal, setHintsModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [hint, setHint] = useState();
  const [hintLoc, setHintLoc] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState({});
  const [originalBoard, setOriginalBoard] = useState(unsolvedBoard);
  const isInitialMount = useRef(true);
  // AUDIO STATES
  const [tileSound, setTileSound] = useState();
  const [invalidTileSound, setInvalidTileSound] = useState();
  const [victorySound, setVictorySound] = useState();
  const [defeatSound, setDefeatSound] = useState();
  const [undoSound, setUndoSound] = useState();

  const [stopTime, setStopTime] = useState(null);

  async function playTileSound() {
    if (soundState) {
      await tileSound.replayAsync();
    }
  }
  async function playVictorySound() {
    if (soundState) {
      await victorySound.replayAsync();
    }
  }

  async function playDefeatSound() {
    if (soundState) {
      await defeatSound.replayAsync();
    }
  }

  async function playInvalidTileSound() {
    if (soundState) {
      await invalidTileSound.replayAsync();
    }
  }

  async function playUndoSound() {
    if (soundState) {
      await undoSound.replayAsync();
    }
  }
  async function initializeAudio() {
    //
    const tileAudioObject = new Audio.Sound();
    const invalidTileAudioObject = new Audio.Sound();
    const undoAudioObject = new Audio.Sound();
    const victoryAudioObject = new Audio.Sound();
    const defeatAudioObject = new Audio.Sound();
    try {
      await tileAudioObject.loadAsync(require("./Sounds/tile_press1.mp3"));
      //
    } catch (err) {
      console.error(err);
    }
    try {
      await invalidTileAudioObject.loadAsync(
        require("./Sounds/invalid_press.mp3")
      );
      //
    } catch (err) {
      console.error(err);
    }
    try {
      await victoryAudioObject.loadAsync(require("./Sounds/victory2.mp3"));
      //
    } catch (err) {
      console.error(err);
    }
    try {
      await defeatAudioObject.loadAsync(require("./Sounds/defeat.mp3"));
      //
    } catch (err) {
      console.error(err);
    }
    try {
      await undoAudioObject.loadAsync(require("./Sounds/undo.mp3"));
      //
    } catch (err) {
      console.error(err);
    }
    setTileSound(tileAudioObject);
    setInvalidTileSound(invalidTileAudioObject);
    setVictorySound(victoryAudioObject);
    setDefeatSound(defeatAudioObject);
    setUndoSound(undoAudioObject);
  }

  const save = async (minutes, seconds) => {
    try {
      const gameState = {
        board,
        difficulty,
        lives: `LIVES: ${livesMappings[life]}`,
        gameMode,
        solvedBoard,
        mistakes,
        moves,
        initialMinute: minutes,
        initialSecond: seconds,
      };
      const gameStateString = JSON.stringify(gameState);
      await AsyncStorage.setItem("currentGame", gameStateString);
      return gameStateString;
    } catch (err) {
      console.error(err);
    }
  };

  const updateStats = async () => {
    const today = new Date().toLocaleDateString();
    const newMin = stopTime[0];
    const newSec = stopTime[1];

    const COMPLETEDLEVELKEY = difficulty + "totalGames";
    const HIGHSCORELEVELKEY = difficulty + "highScore";

    let highScore = await AsyncStorage.getItem(HIGHSCORELEVELKEY);
    let totalGames = await AsyncStorage.getItem(COMPLETEDLEVELKEY);

    highScore = JSON.parse(highScore);
    await AsyncStorage.setItem(COMPLETEDLEVELKEY, (+totalGames + 1 || 1).toString());
    if (highScore === null || (newMin === highScore[0] ? newSec < highScore[1] : newMin < highScore[0]) ) {
      try {
        const newHighScore = JSON.stringify([newMin, newSec, today]);
        await AsyncStorage.setItem(HIGHSCORELEVELKEY, newHighScore);
      } catch (err) {
        console.error("error saving new score", err)
      }
    }
  };

  function start() {
    var [unsolvedBoard, solvedBoard] = funcs.generate(difficulty);
    setLife(livesMappings[initialLife]);
    setBoard(unsolvedBoard);
    setOriginalBoard(unsolvedBoard);
    setSolution(solvedBoard);
    setMistakes({});
    setMoves([]);
    setTarget(undefined);
  }

  useEffect(() => {
    initializeAudio();
    return () => {
      tileSound.unloadAsync();
      victorySound.unloadAsync();
      invalidTileSound.unloadAsync();
      defeatSound.unloadAsync();
    };
  }, []);

  function eraseNotes() {
    if (notes[JSON.stringify(target)]) {
      var copyNotes = { ...notes };
      copyNotes[JSON.stringify(target)].clear();
      setNotes(copyNotes);
    }
  }

  //This allows us to navigate back to home screen when user clicks out of game over modal
  useEffect(() => {
    const updateStatAsync = async () => {
      if (clockMode) await updateStats();
      console.log("removed");
      await AsyncStorage.removeItem("currentGame");
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      updateStatAsync();
      props.navigation.navigate("homepage");
    }
  }, [gameEnded]);

  if (notesMode) {
    if (number && target) {
      if (notes[JSON.stringify(target)]) {
        var copyNotes = { ...notes };
        copyNotes[JSON.stringify(target)].add(number);
        setNotes(copyNotes);
      } else {
        var copyNotes = { ...notes };
        copyNotes[JSON.stringify(target)] = new Set([number]);
        setNotes(copyNotes);
      }
      setNumber(undefined);
    }
  } else {
    if (number && target) {
      var changedBoard = [...board];
      board[target[0]][target[1]] = number;
      var validMove = solution[target[0]][target[1]] === number.toString();
      if (validMove) {
        playTileSound();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        delete mistakes[JSON.stringify(target)];
        setTarget(undefined);
        if (board.flat().join("") === solution.flat().join("")) {
           setSuccessModal(true);
           setEndModal(true);
           updateStats();
        }
        //to test success modal comment out all above
        // setSuccessModal(true);
        // setEndModal(true);
      } else {
        playInvalidTileSound();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        var copyMistakes = { ...mistakes };
        var updatedMoves = [...moves];
        copyMistakes[JSON.stringify(target)] = number;
        updatedMoves.push([target[0], target[1]]);
        setMistakes(copyMistakes);
        setLife(life - 1);
        setMoves(updatedMoves);
        if (life === 1) setEndModal(true);
      }
      setBoard(changedBoard);
      setNumber(undefined);
    }
  }

  return (
    <GameContext.Provider
      value={{
        board,
        target,
        setTarget,
        mistakes,
        notesMode,
        notes,
        hintLoc,
        tileTheme,
        hint,
        hintsModal,
        setHintsModal,
        setHintLoc,
        successModal,
        setSuccessModal,
        setGameEnded,
        start,
        playVictorySound,
        endModal,
        setEndModal,
        playDefeatSound,
      }}
    >
      <View style={{ backgroundColor: backColor, flex: 1 }}>
        <Success_Component />
        <GameOver_Component />
        <HintsModal />
        <View style={styles.notchBlock}></View>
        <Header_Component
          level={level}
          navigation={props.navigation}
          isTimed={clockMode}
          save={save}
          initialMinute={props.route.params.initialMinute || 0}
          initialSecond={props.route.params.initialSecond || 0}
          successModal={successModal}
          stopTime={stopTime}
          setStopTime={setStopTime}
        ></Header_Component>
        <Grid></Grid>
        <Lives lives={life} isLifeMode={isLifeMode} />
        <Pieces_Component
          setNumber={setNumber}
          target={target}
          moves={moves}
          board={board}
          setBoard={setBoard}
          colorTheme={tileTheme}
          playUndoSound={playUndoSound}
        />
        <Actions_Component
          board={board}
          setBoard={setBoard}
          originalBoard={originalBoard}
          solution={solution}
          setNotesMode={setNotesMode}
          notesMode={notesMode}
          setHintsModal={setHintsModal}
          setHint={setHint}
          mistakes={mistakes}
          setHintLoc={setHintLoc}
          eraseNotes={eraseNotes}
        ></Actions_Component>
      </View>
    </GameContext.Provider>
  );
};

export { Game_Board_View };




