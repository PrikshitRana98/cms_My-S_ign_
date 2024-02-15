import React, {useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import {moderateScale} from '../../Helper/scaling';
import ActiveIcon from '../../Assets/Images/PNG/GreenCircle.png';
import AppText from '../Atoms/CustomText';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';

const SuccessModal = ({Msg,onComplete}) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);

  useEffect(() => {
    setTimeout(() => {
      onComplete();
    }, 2000);
  }, [onComplete]);

  return (
    <Portal>
      <Modal
        visible
        onDismiss={() => onComplete()}
        style={{
          flex: 1,
        }}>
        <View style={Styles.mainContainer}>
          <View style={Styles.modalView}>
            <Image
              source={ActiveIcon}
              style={{
                height: moderateScale(100),
                width: moderateScale(100),
              }}
            />
            <AppText style={Styles.newMediaText}>
              {Msg}
            </AppText>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default SuccessModal;

const ModalStyles = COLORS =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
    mainContainer: {
      //   flex: 1,
      height: '100%',
      justifyContent: 'center',
      padding: moderateScale(30),
    },
    modalView: {
      height: '40%',
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(25),
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(20),
    },
    newMediaText: {
      fontSize: moderateScale(20),
      textAlign: 'center',
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
    },
  });
