import { styles } from "./Styles";
import Large_button from "./Large_button/button";
import { View } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native'

const Button_Component = (
  props = {
    navigation,
    difficulty,
    gameMode,
    lives,
    colorTheme,
    prevGame,
    soundState
  }) => {
  const [storedGame, setStoredGame] = useState();
  const isFocused = useIsFocused();
  const getGame = async () => {
    try {
      const gameState = await AsyncStorage.getItem("currentGame");
      setStoredGame(gameState);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect( () => {
     getGame()
  }, [isFocused]);

  return (
    <View style={styles.buttonContainer}>
      <Large_button
        content="n e w g a m e"
        ID="1"
        navigation={props.navigation}
        difficulty={props.difficulty}
        gameMode={props.gameMode}
        lives={props.lives}
        colorTheme={props.colorTheme}
        soundState={props.soundState}
      />
      {storedGame && <Large_button
        gameState={props.prevGame ? props.prevGame : storedGame}
        content="r e s u m e"
        ID="0"
        navigation={props.navigation}
        colorTheme={props.colorTheme}
        soundState={props.soundState}
      />}
    </View>
  );
};

export { Button_Component };

