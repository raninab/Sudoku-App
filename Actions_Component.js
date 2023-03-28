import { View, Fragment } from "react-native";
import { styles } from "./Styles";
import { Icon_Component } from "./Icon_Component/Icon_Component";
import { Pencil_Icon, Erase_Icon, Hint_Icon } from "./Icon_Component/Icons";
const Actions_Component = (
  props = {
    setHintLoc,
    mistakes,
    board,
    setBoard,
    originalBoard,
    solution,
    setNotesMode,
    notesMode,
    setHintsModal,
    setHint,
    eraseNotes,
  }
) => {
  const Restart = () => {
    props.setBoard(props.originalBoard);
  };
  const createHint = () => {
    for (var mistake in props.mistakes) {
      var [sq, cl] = JSON.parse(mistake);
      props.board[sq][cl] = ".";
    }
    for (var square = 0; square < props.board.length; square++) {
      for (var cell = 0; cell < props.board[square].length; cell++) {
        if (props.board[square][cell] === ".") {
          props.setHint([props.solution[square][cell], square, cell]);
          props.setHintsModal(true);
          props.setHintLoc([square, cell]);
          return;
        }
      }
    }
  };
  const Notes_Icon = (props = { notesMode, setNotesMode }) => {
    if (!props.notesMode) {
      return (
        <Icon_Component
          SVG={Pencil_Icon}
          text={"Notes"}
          onPressFunction={() => props.setNotesMode(!props.notesMode)}
        ></Icon_Component>
      );
    } else {
      return (
        <>
          <Icon_Component
            SVG={Pencil_Icon}
            text={"Notes"}
            onPressFunction={() => props.setNotesMode(!props.notesMode)}
          ></Icon_Component>
          <View style={styles.dot}></View>
        </>
      );
    }
  };
  return (
    <View style={styles.footerContainer}>
      {props.notesMode ? (
        <Icon_Component
          SVG={Erase_Icon}
          text={"Erase"}
          onPressFunction={props.eraseNotes}
        ></Icon_Component>
      ) : null}
      <Notes_Icon
        notesMode={props.notesMode}
        setNotesMode={props.setNotesMode}
      ></Notes_Icon>
      <Icon_Component
        SVG={Hint_Icon}
        text={"Hint"}
        onPressFunction={() => createHint()}
      ></Icon_Component>
    </View>
  );
};

export { Actions_Component };
