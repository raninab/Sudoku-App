import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "./Styles.js";
import { Left_Arrow, Right_Arrow } from "./icon_button/Icons";
import { IconButton } from "./icon_button/IconButton";
import { Audio } from "expo-av";
import * as CONSTANTS from "../Constants/constants.js";
const Selections_Component = ({
  difficulty,
  setDifficulty,
  gameMode,
  setGameMode,
  lives,
  setLives,
  soundState
}) => {
  const [diffIdx, setDiffIdx] = useState(0);
  const [modeIdx, setModeIdx] = useState(0);
  const [livesIdx, setLivesIdx] = useState(2);
  const [leftButtonSound, setLeftButtonSound] = useState();
  const [rightButtonSound, setRightButtonSound] = useState();

  const diff = [CONSTANTS.DIFFICULTY_EASY, CONSTANTS.DIFFICULTY_MEDIUM, CONSTANTS.DIFFICULTY_HARD];
  const mode = [CONSTANTS.GAME_MODE_CLASSIC, CONSTANTS.GAME_MODE_CLOCK];
  const live = [CONSTANTS.LIVES_ONE, CONSTANTS.LIVES_TWO, CONSTANTS.LIVES_THREE, CONSTANTS.LIVES_INFINITY];

  async function playLeftButtonSound() {
    if(soundState) {await leftButtonSound.replayAsync();}
  }

  async function playRightButtonSound() {
    if(soundState) {await rightButtonSound.replayAsync();}
  }

  async function initAudio() {
    console.log("Initializing HomePage Selections Audio")
    const leftButtonAudioObject = new Audio.Sound();
    const rightButtonAudioObject = new Audio.Sound();
    try {
      await leftButtonAudioObject.loadAsync(require("../Game_Board/Sounds/left_selection.mp3"));
      //
    } catch (err) {
      console.error(err);
    }
    try {
      await rightButtonAudioObject.loadAsync(require("../Game_Board/Sounds/right_selection.mp3"));
      //
    } catch (err) {
      console.error(err)
    }
    setLeftButtonSound(leftButtonAudioObject);
    setRightButtonSound(rightButtonAudioObject);
  }

  useEffect(() => {
    initAudio();
    return () => {
      leftButtonSound.unloadAsync();
      rightButtonSound.unloadAsync();
    };
  }, []);

  const cycle = (flag, index, setIndex, setSelection, selection) => {
    let newIndex = index;
    if (flag == "left") {
      if (index === 0) {
        newIndex = selection.length - 1;
      } else if (index < 0) {
        newIndex = selection.length - 1;
      } else {
        newIndex = index - 1;
      }
      playLeftButtonSound();
    } else if (flag == "right") {
      if (index === selection.length - 1) {
        newIndex = 0;
      } else if (index < 0) {
        newIndex = 0;
      } else {
        newIndex = index + 1;
      }
      playRightButtonSound();
    }
    setIndex(newIndex);
    setSelection(selection[newIndex]);
  };

  const cycleDifficulty = (flag) =>
    cycle(flag, diffIdx, setDiffIdx, setDifficulty, diff);
  const cycleMode = (flag) =>
    cycle(flag, modeIdx, setModeIdx, setGameMode, mode);
  const cycleLives = (flag) =>
    cycle(flag, livesIdx, setLivesIdx, setLives, live);

  return (
    <View style={styles.selectionsContainer}>
      <View style={styles.selectButton}>
        <View style={styles.leftArrow}>
          <IconButton
            SVG={Left_Arrow}
            onPressFunction={() => cycleDifficulty("left")}
          ></IconButton>
        </View>
        <View style={styles.selectText}>
          <Text>{difficulty}</Text>
        </View>
        <View style={styles.rightArrow}>
          <IconButton
            SVG={Right_Arrow}
            onPressFunction={() => cycleDifficulty("right")}
          ></IconButton>
        </View>
      </View>

      <View style={styles.selectButton}>
        <View style={styles.leftArrow}>
          <IconButton
            SVG={Left_Arrow}
            onPressFunction={() => cycleMode("left")}
          ></IconButton>
        </View>
        <View style={styles.selectText}>
          <Text>{gameMode}</Text>
        </View>
        <View style={styles.rightArrow}>
          <IconButton
            SVG={Right_Arrow}
            onPressFunction={() => cycleMode("right")}
          ></IconButton>
        </View>
      </View>

      <View style={styles.selectButton}>
        <View style={styles.leftArrow}>
          <IconButton
            SVG={Left_Arrow}
            onPressFunction={() => cycleLives("left")}
          ></IconButton>
        </View>
        <View style={styles.selectText}>
          <Text>{lives}</Text>
        </View>
        <View style={styles.rightArrow}>
          <IconButton
            SVG={Right_Arrow}
            onPressFunction={() => cycleLives("right")}
          ></IconButton>
        </View>
      </View>
    </View>
  );
};

export { Selections_Component };
