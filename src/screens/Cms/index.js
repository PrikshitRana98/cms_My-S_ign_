import React from 'react';
import {Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SubHeaderText from '../../Components/Atoms/SubHeaderText';
import ClockHeader from '../../Components/Atoms/ClockHeaders';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import CMSStyles from './style';
const Cms = () => {
  const themeColor = useThemeContext();
  const Styles = CMSStyles(themeColor);

  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      <View style={Styles.headerView}>
        <View style={Styles.schedulerView}>
          <SubHeaderText
            title="Scheduler"
            containerStyle={{
              paddingBottom: moderateScale(10),
            }}
          />
          <Text style={Styles.recordsText}>Total Records : 1-10 of 25</Text>
        </View>
        <View style={Styles.bulkAction}>
          <SubHeaderText
            title="Bulk Action"
            containerStyle={{
              paddingBottom: moderateScale(0),
            }}
            textStyle={{
              fontSize: moderateScale(15),
            }}
          />
          <Feather
            name={'chevron-down'}
            size={20}
            color={themeColor.textColor}
          />
        </View>
      </View>
    </View>
  );
};

export default Cms;
