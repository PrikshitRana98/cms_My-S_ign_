import React from 'react';
import {View, Text, StyleSheet, FlatList, Image, Pressable} from 'react-native';
import {useThemeContext} from '../../../../appConfig/AppContext/themeContext';
import {moderateScale, width} from '../../../../Helper/scaling';
import {FONT_FAMILY} from '../../../../Assets/Fonts/fontNames';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppText from '../../../Atoms/CustomText';
import ThemedText from '../../../Atoms/ThemedText';
import MoveIcons from '../../../../Assets/Images/PNG/move.png';
import DeleteIcon from '../../../../Assets/Images/PNG/delete.png';

const CampaignChildList = ({data,deleteCampaign,itemData,workFlow}) => {
  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commonView, {width:returnwidth()}]}>
        <AppText style={Styles.commonText}>{value}</AppText>
      </View>
    );
  };

  const getBackgroundColor = value => {
    if (value === 'PUBLISHED') {
      return {
        backgroundColor: themeColor.pubGreenBack,
      };
    } else if (value === 'SUBMITTED') {
      return {
        backgroundColor: themeColor.themeLight,
      };
    } else if (value === 'DRAFT') {
      return {
        backgroundColor: themeColor.draftYellowBack,
      };
    }
  };

  const getTextColor = value => {
    if (value === 'PUBLISHED') {
      return {
        color: themeColor.pubGreen,
      };
    } else if (value === "SUBMITTED") {
      return {
        color: themeColor.themeColor,
      };
    } else if (value === 'DRAFT') {
      return {
        color: themeColor.draftYellow,
      };
    }
  };
  const returnwidth=()=>{
    let value = 100/6
    if(workFlow && workFlow?.approverWorkFlow=="CAMPAIGN_STRING"){
      value = 100/7
    }
    return `${value}%`
  }
  const renderState = (value, index) => {
    return (
      <View style={[Styles.commonView,{width:returnwidth()}]}>
        {/* <ThemedText
          title={value}
          containerStyle={[Styles.statusView, getBackgroundColor(value)]}
          textStyles={getTextColor(value)}
        /> */}
      </View>
    );
  };

  const btndeletAction=(item)=>{
    let dataX = {...itemData}
    let campaignArr  = dataX?.campaigns?.filter((it)=>it.campaignId!=item.campaignId)
    dataX['campaigns']=campaignArr;
    console.log('dataX',dataX)
    console.log('campaignArr',campaignArr)
    deleteCampaign(dataX)
  } 
  const renderAction = (item) => {
    return (
      <View
        style={[
          Styles.commonView,
          {width: returnwidth(), flexDirection: 'row', alignItems: 'center'},
        ]}>
        {/* <View style={Styles.iconBackView}>
          <Image source={MoveIcons} style={Styles.iconStyle} />
        </View> */}
        <Pressable onPress={()=>{
          btndeletAction(item)
        }}>
        <View style={Styles.iconBackView}>
          <Image source={DeleteIcon} style={Styles.iconStyle} />
        </View>
        </Pressable>
      </View>
    );
  };

  const renderCampaignRow = ({item, index}) => (
    <View style={Styles.renderCampaignContainer}>
       
      <View style={[Styles.campaignNameView,{width:returnwidth()}]}>
        <AppText style={Styles.campaignNameText}>{item.campaignName}</AppText>
      </View>
      {workFlow &&
            workFlow?.approverWorkFlow == "CAMPAIGN_STRING" && renderTextView(' ', index)}
      {renderTextView(' ', index)}
      {renderDuretionView(item.displayDurationInSeconds, item.totalDurationInSeconds)}
      {renderTextView(item.numberOfLoops, index)}
      {renderState(' ', index)}
      {renderAction(item)}
    </View>
  );

  const renderDuretionView = (value,value1) => {
    const {  minutes, seconds }  =  convertSecondsToMinutesAndSeconds(value);
    const data  =  convertSecondsToMinutesAndSeconds(value1);

    return (
      <View
        style={{
          width:returnwidth(),
          flexDirection: "row",
          paddingRight: 2.5,
        }}
      >
        <View
          style={{
            width: "50%",
            marginHorizontal: moderateScale(0.5),
            backgroundColor:'#F9F9FB',
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: moderateScale(2),
            paddingVertical: moderateScale(5),
          }}
        >
          <AppText style={Styles.commonText}>{`${minutes}m:${seconds}s`}</AppText>

        </View>
        <View
          style={{
            width: "50%",
            marginHorizontal: moderateScale(0.5),
            backgroundColor: '#F9F9FB',
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: moderateScale(2),
            paddingVertical: moderateScale(5),
          }}
        >
          <AppText style={Styles.commonText}>{`${data.minutes}m:${data.seconds}s`}</AppText>
        </View>
      </View>
    );
  };
  function convertSecondsToMinutesAndSeconds(totalSeconds) {
    if(totalSeconds){
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;
      return {
        minutes,
        seconds
      };
    }else{
      return {
        minutes:0,
        seconds:0
      };
    }
  }
  const HeaderComp = () => {
    return (
      <View style={Styles.campaignHeaderText}>
        <AppText style={Styles.boldText}>Campaign Name</AppText>
      </View>
    );
  };

  return (
    <View style={Styles.campaignContainer}>
      <FlatList
        data={data}
        renderItem={renderCampaignRow}
        // ListHeaderComponent={HeaderComp}
      />
    </View>
  );
};

export default CampaignChildList;

const CampaignStyles = COLORS =>
  StyleSheet.create({
    renderCampaignContainer: {
      flexDirection: 'row',
      width:moderateScale(width * 5),
      
    },
    campaignContainer: {
      backgroundColor: '#E6E9F2', 
    },
    campaignNameView: {
      marginHorizontal: moderateScale(1),
      backgroundColor: '#F9F9FB',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
      flexDirection: 'row',
      alignItems: 'center',
    },
    campaignNameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      marginStart: moderateScale(10),
    },
    commonView: {
 
      marginHorizontal: moderateScale(1),
      backgroundColor: '#F9F9FB',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(8),
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    boldText: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    campaignHeaderText: {
      paddingHorizontal: moderateScale(30),
      padding: 10,
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(10),
    },
    iconBackView: {
      height: moderateScale(32),
      width: moderateScale(32),
      borderRadius: moderateScale(17),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(5),
      marginHorizontal: moderateScale(5),
    },
    iconStyle: {
      height: moderateScale(18),
      width: moderateScale(18),
      resizeMode: 'contain',
    },
    statusView: {
      alignSelf: 'center',
    },
  });
