import { styles } from "./Styles";
import { View, Text } from "react-native";
import { IconButton } from "./icon_button/IconButton";
import { SoundOn_Icon, SoundOff_Icon, Calendar, Pallete_Icon } from "./icon_button/Icons";
import { useState } from "react";
import Pallete from "./Pallete";
import { doc, getDoc } from "firebase/firestore"; 
import { changeBoard } from "../Game_Board/gameLogic2";
import { 
  LIVES_THREE, 
  GAME_MODE_CLASSIC,
  DIFFICULTY_HARD
} from "../Constants/constants";
const colorMap = [{
  //OG
  tileColor: "#F4C3C3",
  backgroundColor: "white"
}, {
  //black
  tileColor: "grey",
  backgroundColor: "rgba(0,0,0,0.7)"
}, {
  //lavender
  tileColor: "#B2D7AC",
  backgroundColor: "#AEA6E2"
}];

const Header_Component = ({
  colorTheme,
  setColorTheme,
  db,
  navigation,
  soundState,
  setSoundState
}
  ) => {

  const currentDate = "0";
  return (
    <View style={styles.headerContainer}>
      <View style={{left:30, top:10}}>
        <IconButton
          SVG={soundState? SoundOn_Icon:SoundOff_Icon}
          onPressFunction={() => {
            setSoundState(!soundState);
          }}
        ></IconButton>
      </View>

      <View style={[{"backgroundColor": colorTheme.tileColor},styles.calendarContainer]}>
        <IconButton
          SVG={Calendar}
          onPressFunction={async () => {
            console.warn("calendar pressed");
            const docRef = doc(db, "daily_sudoku", "N3TI8zjUZdAIxWpDm4TK");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const unsolvedBoard  = changeBoard(docSnap.data()[currentDate]["puzzle"]);
              const solvedBoard  = changeBoard(docSnap.data()[currentDate]["solvedPuzzle"]);
              console.log("DATA FROM FIREBASE " + solvedBoard.toString)
              console.log("DATA FROM FIREBASE " + unsolvedBoard.toString)
              console.log("DATA FROM FIREBASE " + GAME_MODE_CLASSIC.toString)

              navigation.navigate("gameBoard", {
                DIFFICULTY_HARD,
                LIVES_THREE,
                GAME_MODE_CLASSIC,
                colorTheme,
                unsolvedBoard,
                solvedBoard,
                soundState,
              });
            } 
          }}
        ></IconButton>
      </View>
      
      <Pallete style={{top:10, right:50}}
       setColorTheme={setColorTheme}>
       </Pallete>

      {/*<View style={styles.palleteContainer}>
        <IconButton
          SVG={Pallete_Icon}
          onPressFunction={() => {
            setColorTheme(colorMap[colorIndex % 3])
            setColorIndex(colorIndex + 1)
          }}
        ></IconButton>
        </View> */}
    </View>
  );
};

export { Header_Component };
