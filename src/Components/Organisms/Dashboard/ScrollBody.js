/* eslint-disable react-native/no-inline-styles */
import React,{useState,useRef,useEffect} from 'react';
import {FlatList, Image, ScrollView, StyleSheet, View} from 'react-native';
import {FONT_FAMILY} from '../../../Assets/Fonts/fontNames';
import ReportImage from '../../../Assets/Images/PNG/profit-report.png';
import {moderateScale, width} from '../../../Helper/scaling';
import {useThemeContext} from '../../../appConfig/AppContext/themeContext';
import AppText from '../../Atoms/CustomText';
import SubHeaderText from '../../Atoms/SubHeaderText';
import moment from 'moment';
import Pagination from '../../Atoms/Pagination';

const ScrollBody = ({recentMedia, selectedValue, recentCampaign,recentCampaignString,recentInActive,recentpublished,recentDevices,recentInactiveDevices,recentPlanoSche}) => {
  // console.log('recentCampaign',recentCampaign)
  // console.log('recentCampaignString',recentCampaignString)
  // console.log('recentInActive',recentInActive)
  const videoIcon=require('../../../Assets/Images/PNG/Video.png')
  const audioIcon=require('../../../Assets/Images/PNG/Audio.png')
  const imgIcon=require('../../../Assets/Images/PNG/Image.png')
  const txtIcon=require('../../../Assets/Images/PNG/text-format.png')
  const pdfIcon=require('../../../Assets/Images/PNG/pdf.png')
  const docIcon=require('../../../Assets/Images/PNG/Doc.png')
  const pptIcon=require('../../../Assets/Images/PNG/ppt.png')
  const htmlIcon=require('../../../Assets/Images/PNG/html.png')
  const rssIcon=require('../../../Assets/Images/PNG/rss.png')
  const twiterIcon=require('../../../Assets/Images/PNG/twitter.png')
  const fbIcon=require('../../../Assets/Images/PNG/facebook.png')
  const stremIcon=require('../../../Assets/Images/PNG/stream.png')
  const urlIcon=require('../../../Assets/Images/PNG/url.png')



  const themeColor = useThemeContext();
  const Styles = ScrollStyles(themeColor);
  
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  function niceBytes(x) {
    let l = 0,
      n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  }
  const renderRow = ({item, index}) => {
    const formattedCreatedOn = moment(item?.createdOn).format("YYYY/MM/DD");
    // let  { hours, minutes, seconds }  = secondsToHMS(item.defaultDurationInSeconds);
    let  { minutes, seconds }  = convertSecondsToMinutesAndSeconds(item.defaultDurationInSeconds);
    // let duration = `${hours}H:${minutes}M:${seconds}S`;
    let duration = `${minutes}m:${seconds}s`;
    return (
      recentMedia != null   ? (

      <View style={Styles.renderBody}>
        <View style={Styles.iconAndText}>
          <View style={Styles.iconView}>
          <Image
            source={item.type.toLowerCase()=="text"?txtIcon
                :item.type.toLowerCase()=="url"?urlIcon
                :item.type.toLowerCase()=="image"?imgIcon
                :item.type.toLowerCase()=="html"?htmlIcon
                :item.type.toLowerCase()=="rss"?rssIcon
                :item.type.toLowerCase()=="facebook"?fbIcon
                :item.type.toLowerCase()=="twitter"?twiterIcon
                :item.type.toLowerCase()=="stream_url"?stremIcon
                :item.type.toLowerCase()=="pdf"?pdfIcon
                :item.type.toLowerCase()=="audio"?audioIcon
                :item.type.toLowerCase()=="ppt"?pptIcon
                :item.type.toLowerCase()=="doc"?docIcon
                :docIcon 
              }
            resizeMode="contain"
            style={[Styles.imageStyle,{
              height: moderateScale(25),
              width: moderateScale(25),}]}
          />
          </View>
          <AppText numberOfLines={1} style={Styles.mediaName}>{item.name}</AppText>
        </View>
        <AppText style={Styles.commonText}>{niceBytes(item.mediaSize)}</AppText>
        <AppText style={Styles.commonText}>{formattedCreatedOn}</AppText>
        <AppText style={Styles.commonText}>{item.type}</AppText>
        <AppText style={Styles.commonText}>{duration}</AppText>
      </View>
      ) : (
        <View>
        <AppText style={Styles.noDataFound}>
        No data found
      </AppText>
      </View>
      )
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
  function secondsToHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  }
  const renderRowCamapign = ({item, index}) => {
    const formattedCreatedOn = moment(item?.createdOn).format("YYYY/MM/DD");
    let  {  minutes, seconds }  = convertSecondsToMinutesAndSeconds(item.totalDurationOfCampaignInSeconds);
    let duration = `${minutes}m:${seconds}s`;
    return (
      (recentCampaign != null && recentCampaign?.length>0)  ? (

      <View style={Styles.renderBody}>
        <View style={Styles.iconAndText}>
          <View style={Styles.iconView}>
            <Image
              source={ReportImage}
              style={{width: moderateScale(16), height: moderateScale(20)}}
            />
          </View>
          <AppText style={Styles.mediaName}>{item.campaignName}</AppText>
        </View>
        <AppText style={[Styles.commonText1,{height:70}]}>{duration}</AppText>
        <AppText style={[Styles.commonText1,{height:70}]}>{item.campaignType}</AppText>
        <AppText style={[Styles.commonText,{height:70}]}>{formattedCreatedOn}</AppText>
        <AppText numberOfLines={2} style={[Styles.commonText,{height:70}]}>{item.state}</AppText>
      </View>
      ) : (
        <View>
        <AppText style={Styles.noDataFound}>
        No data found
      </AppText>
      </View>
      )
    );
  };
  const renderRowCamapignString = ({item, index}) => {
    const formattedCreatedOn = moment(item?.createdOn).format("YYYY/MM/DD");
    let  {  minutes, seconds }  = convertSecondsToMinutesAndSeconds(item.displayDurationInSeconds);
    let duration = `${minutes}m:${seconds}s`;
    return (
      (recentCampaignString != null  && recentCampaignString?.length>0) ? (

      <View style={Styles.renderBody}>
        <View style={Styles.iconAndText}>
          <View style={Styles.iconView}>
            <Image
              source={ReportImage}
              style={{width: moderateScale(16), height: moderateScale(20)}}
            />
          </View>
          <AppText style={Styles.mediaName}>{item.campaignStringName}</AppText>
        </View>
        <AppText style={Styles.commonText1}>{duration}</AppText>
        <AppText style={Styles.commonText1}>{item.state}</AppText>
        
      </View>
      ) : (
        <View>
        <AppText style={Styles.noDataFound}>
        No data found
      </AppText>
      </View>
      )
    );
  };
  const renderRowRegistered = ({item, index}) => {
    return (
      (recentDevices != null && recentDevices?.length>0)  ? (
      <View style={Styles.renderBody}>
        <View style={Styles.iconAndText}>
          <View style={Styles.iconView}>
            <Image
              source={ReportImage}
              style={{width: moderateScale(16), height: moderateScale(20)}}
            />
          </View>
          <AppText style={Styles.mediaName}>{item.deviceId}</AppText>
        </View>
        <AppText style={Styles.commonText1}>{item?.deviceName}</AppText>
        <AppText style={Styles.commonText1}>{item?.deviceOs}</AppText>
        <AppText style={Styles.commonText}>{item?.location?.locationName}</AppText>
        <AppText style={Styles.commonText}>{'-'}</AppText>
        
      </View>) : (
         <View>
         <AppText style={Styles.noDataFound}>
         No data found
       </AppText>
       </View>

      )
    );
  };
  const renderRowActive = ({ item, index }) => {
    const formattedCreatedOn = moment(item?.startDate).format("YYYY/MM/DD");

    return (
      (recentInactiveDevices != null && recentInactiveDevices?.length>0 )  ? 
        (
          <View style={Styles.renderBody}>
            <View style={Styles.iconAndText}>
              <View style={Styles.iconView}>
                <Image
                  source={ReportImage}
                  style={{width: moderateScale(16), height: moderateScale(20)}}
                />
              </View>
              <AppText style={Styles.mediaName}>{item.deviceId}</AppText>
            </View>
            <AppText style={Styles.commonText1}>{item?.location?.locationName || '--'}</AppText>
            <AppText style={Styles.commonText1}>{item?.createdOn}</AppText>
            <AppText style={Styles.commonText}>{item.status==2 ? 'Inactive' : 'Active'}</AppText>
            
          </View>)
      : (
        <View>
          <AppText style={Styles.noDataFound}>
          No data found
        </AppText>
        </View>
      )
    );
  }
  const renderPlanoSchedul = ({ item, index }) => {
    const formattedCreatedOn = moment(item?.startDate).format("YYYY/MM/DD");

    return (
          <View style={[Styles.renderBody,{width:'100%'}]}>
            <View style={[Styles.iconAndText,{width:'33.3%'}]}>
              <View style={Styles.iconView}>
                <Image
                  source={ReportImage}
                  style={{width: moderateScale(16), height: moderateScale(20)}}
                />
              </View>
              <AppText style={Styles.mediaName}>{item.title}</AppText>
            </View>

            <AppText style={Styles.commonText1}>{item?.startDate}</AppText>
            <AppText style={[Styles.commonText,{width:'44%',textAlign:'flex-start',paddingLeft:25}]}>{item?.state}</AppText>
          </View>
    );
  }

  let dataHeader= [];
  if (selectedValue === 'Media Uploads') {
    dataHeader = ['Media Name', 'File Size', 'Created Date', 'Type', 'Duration'];
  } else if (selectedValue === 'Campaign') {
    dataHeader = ['Name', 'Duration', 'Type', 'Date','State'];
  } else if(selectedValue === 'Campaign String') {
    dataHeader = ['String Name', 'Duration', 'State'];
  } else if(selectedValue === 'Recently Registered MP') {
    dataHeader = ['MP ID', 'MP Name', 'MP OS', 'Location', 'Last Sync'];
  }else if(selectedValue === 'Planograms' || selectedValue === 'Schedulers'){
    dataHeader = ['Name', 'Date', 'State'];
  } else {
    dataHeader = ['MP ID', 'Location', 'Date', 'Status', ];
  }
 
  const headerComp = () => {
    return (
      <View style={[Styles.headerContainer,]}>
        {dataHeader.map((item, index) => (
          <SubHeaderText
            key={item + index}
            title={item}
            textStyle={Styles.headerTextStyle}
            containerStyle={[
              Styles.headerElement,
              {
                width: index === 0 ? '30%' : '17%',
              },
            ]}
          />
        ))}
      </View>
    );
  };

  
  const flatListRef = useRef(null)
  useEffect(()=>{
    if(flatListRef.current){
      flatListRef.current.scrollTo({x: 0, y: 0, animated: true})
    }
  },[selectedValue])
  return (
    <ScrollView
      bounces={false}
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={Styles.mainContainer}>
      <FlatList
        scrollEnabled={true}
        nestedScrollEnabled
        bounces={false}
        stickyHeaderIndices={[0]}
        data={selectedValue === 'Media Uploads'? recentMedia : selectedValue === 'Campaign'? recentCampaign :
         selectedValue === "Campaign String" ? recentCampaignString 
         : selectedValue === "Recently Registered MP" ? recentDevices 
         : (selectedValue=="Planograms" || selectedValue=="Schedulers") ? recentPlanoSche 
         : recentInactiveDevices
       }
        renderItem={selectedValue === 'Media Uploads'? renderRow : selectedValue === 'Campaign'? renderRowCamapign : selectedValue === "Campaign String" ? renderRowCamapignString : selectedValue === "Recently Registered MP" ? renderRowRegistered : (selectedValue=="Planograms" || selectedValue=="Schedulers") ? renderPlanoSchedul : renderRowActive }
        ListHeaderComponent={headerComp}
      />
    </ScrollView>
  );
};

export default ScrollBody;

const ScrollStyles = COLOR =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLOR.headerBackground,
      padding: moderateScale(2),
      width: '100%',
      marginBottom: moderateScale(20),
      height:moderateScale(320)
    },
    headerContainer: {
      flexDirection: 'row',
      width: moderateScale(width * 2),
      backgroundColor: COLOR.headerBackground,
    },
    noDataFound:{
     margin:moderateScale(30),
     color:COLOR.themeColor,
     fontSize:moderateScale(16),
     marginLeft:moderateScale(100)

    },
    headerElement: {
      paddingBottom: moderateScale(10),
      padding: moderateScale(10),
      justifyContent: 'center',
      marginHorizontal: moderateScale(2),
    },
    mediaName: {
      fontSize: moderateScale(16),
      color: COLOR.textColor,
      marginHorizontal: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginRight: moderateScale(18)
    },
    iconView: {
      padding: moderateScale(5),
      borderRadius: moderateScale(6),
      borderWidth: moderateScale(1),
      borderColor: COLOR.cardBorder,
    },
    commonText: {
      fontSize: moderateScale(15),
      fontWeight: '400',
      marginHorizontal: moderateScale(1),
      backgroundColor: COLOR.white,
      paddingVertical: moderateScale(15),
      color: COLOR.textColor,
      textAlign: 'center',
      alignSelf: 'center',
      width: '17%',
    },
    commonText1: {
      fontSize: moderateScale(15),
      fontWeight: '400',
      marginHorizontal: moderateScale(1),
      backgroundColor: COLOR.white,
      paddingVertical: moderateScale(15),
      color: COLOR.textColor,
      textAlign: 'center',
      alignSelf: 'center',
      width: '17%',
    },
    commonText2: {
      fontSize: moderateScale(15),
      fontWeight: '400',
      marginHorizontal: moderateScale(1),
      backgroundColor: COLOR.white,
      paddingVertical: moderateScale(15),
      color: COLOR.textColor,
      textAlign: 'center',
      alignSelf: 'center',
      width: '30%',
    },
    iconAndText: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginHorizontal: moderateScale(1),
      backgroundColor: COLOR.white,
      width: '30%',
      paddingHorizontal: moderateScale(10),
    },
    iconAndText1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginHorizontal: moderateScale(1),
      backgroundColor: COLOR.white,
      width: '40%',
      paddingHorizontal: moderateScale(2),
    },
    renderBody: {
      flexDirection: 'row',
      width: moderateScale(width * 2),
      marginVertical: moderateScale(1),
    },
    headerTextStyle: {
      fontSize: moderateScale(15),
      alignSelf: 'center',
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
  });
