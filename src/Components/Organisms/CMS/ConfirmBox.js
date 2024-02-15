import {
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import { moderateScale } from "../../../Helper/scaling";

const ConfirmBox = ({
  visible = false,
  stateOperation,
  description,
  title,
  yesLoading,
  yesButtonClick,
}) => {
  const themeColor = useThemeContext();
  const styles = Styles(themeColor);
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <Text style={styles.titleStyle}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => {
                stateOperation(false);
              }}
              style={[styles.buttonNo, { marginRight: 10 }]}
            >
              <Text style={styles.buttonTextNo}>No</Text>
            </Pressable>
            <Pressable onPress={()=>{
                yesButtonClick()
            }} style={styles.button}>
                {
                    yesLoading ?
                    <ActivityIndicator color={"#ffffff"} />
                    :
                    <Text style={styles.buttonText}>Yes</Text>
                }
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmBox;

const Styles = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalView: {
      backgroundColor: COLORS.white,
      width: Dimensions.get("screen").width * 0.90,
      alignSelf: "center",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(20),
      borderRadius: 5,
    },
    titleStyle: {
      color: COLORS.iconTheme,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(18),
    },
    description: {
      color: COLORS.black,
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      fontSize: moderateScale(14),
      marginTop: moderateScale(10),
    },
    buttonContainer: {
      flexDirection: "row",
      alignSelf: "flex-end",
      marginTop: 30,
    },
    button: {
      paddingHorizontal: moderateScale(20),
      justifyContent: "center",
      backgroundColor: COLORS.black,
      paddingVertical: moderateScale(8),
      borderRadius: 6,
    },
    buttonText: {
      color: COLORS.white,
      fontFamily: FONT_FAMILY.unselectedText,
      fontSize: moderateScale(16),
    },
   
      buttonNo: {
        paddingHorizontal: moderateScale(20),
        justifyContent: "center",
        // backgroundColor: COLORS.black,
        paddingVertical: moderateScale(8),
        borderRadius: 6,
        borderWidth: 1,
        borderColor:COLORS.unselectedText
      },
      buttonTextNo: {
        color: COLORS.unselectedText,
        fontFamily: FONT_FAMILY.unselectedText,
        fontSize: moderateScale(16),
      },
  });
