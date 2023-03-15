import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    HomePageContainer: {
      width: wp('100%'),
      height: hp('100%'),
    },
    headerContainer: {
      width: wp('100%'),
      flexDirection: "row",
      marginTop: 50,
      justifyContent: "space-between",
    },
    calendarContainer: {
      // backgroundColor:'#F3C3C3',
      top: 70,
      right: 125,
      padding: 40,
      borderRadius:15,
      shadowColor:'grey',
      shadowOpacity:1,
      shadowRadius:2,
      shadowOffset:{width:0, height:3},
    },
    soundContainer: {
      padding: 10
    },
    palleteContainer: {
      padding: 10
    },
    buttonContainer: {
      width: '100%',
      bottom: 125,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectionsContainer: {
      bottom: 175,
      width: '100%',
      alignItems: 'center',
      marginTop: 280,
    },
    footerContainer: {
      width:'100%',
      height: 32,
      flexDirection: "row",
      justifyContent: "center",
      bottom: 75
    },
    footerIcons: {
      flexDirection: 'row',
      width: '50%',
      justifyContent: "center",
      justifyContent: 'space-between'
    },
    titles: {
      marginTop: '30%',
      width: '100%',
      alignItems: 'center',
    },
    title: {
      fontSize: 40,
      fontWeight: '500',
    },
    selectButton: {
      flexDirection: "row",
      width: '100%',
      padding: 10,
      justifyContent: 'center',
  },
    leftArrow: {
        width: "30%"
    },
    rightArrow: {
        width: "30%"
    },
    selectText: {
        width: "40%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    popupHeader: {
      width: '100%',
      height: 40,
      alignItems: 'flex-end'
    },
    PUsubtitle: {
      fontWeight: 'bold',
      marginTop: 15
    },
    PUparagraphs: {
      marginTop: 15
    },
    PUbutton: {
      backgroundColor: 'transparent',
        borderRadius: 100,
        borderColor: '#ffffff',
        marginTop: 20,
        borderWidth: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 25,
        paddingRight: 25,
        marginHorizontal: 5,
        flex: 1
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center'
    },
  });

export { styles };
