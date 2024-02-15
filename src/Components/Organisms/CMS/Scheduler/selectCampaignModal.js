import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {FONT_FAMILY} from '../../../../Assets/Fonts/fontNames';

import {useThemeContext} from '../../../../appConfig/AppContext/themeContext';
import ActionContainer from '../../../Atoms/ActionContainer';
import CommonTitleAndText from '../../../Atoms/CommonTitleAndText';
import AppText from '../../../Atoms/CustomText';
import SearchBox from '../../../Atoms/SearchBox';
import Separator from '../../../Atoms/Separator';
import InfoImage from '../../../../Assets/Images/PNG/info.png';
import { LocalDate1, moderateScale } from '../../../../Helper/scaling';

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


const SelectCampaignModal = ({setModal,data,setindex, setCampaign = () => {}}) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
  const [selectedIndex, setSelectedIndex] = useState();
  const [searchTxt,setSearchTxt]=useState("")
  const [campdata,setcampdata]=useState(data)
  const [campaignSearch, setCampaignSearch] = useState("");
 

  const onChangeCampaignSearch = (txt) => {
    setCampaignSearch(txt);
   
    let fData = data.filter(function (item) {
      const itemData = item.campaignTitle
        ? item.campaignTitle.toUpperCase()
        : "".toUpperCase();
      const textData = txt.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

   
    setcampdata(fData)
    // setState((pre) => {
    //   return { ...pre, campaigns: fData };
    // });
  };



  const renderCampaign = ({item, index}) => {
  
    return (
      <TouchableOpacity
        onPress={() => setSelectedIndex(index)}
        key={item.name + index}
        style={[Styles.campaignContainer(selectedIndex === index)]}>
        <Image  source={{ uri: item?.mediaDetail[0].thumbnailUrl }} style={Styles.imageStyle} />
        <Image source={InfoImage} style={Styles.infoStyle} />
        <AppText style={[Styles.videoName,{color:'black',fontSize:14}]}>
          {item.campaignTitle}.{item.mediaDetail[0].type}{"\n"}{formatBytes(item.mediaDetail[0].mediaSize)} 
          {'\n'} {LocalDate1(item.createdOn)}{"\n"}
          Duration: {item.duration}sec
        </AppText>

        <AppText style={Styles.dateText}>{item.size}</AppText>
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modal
        onDismiss={() => setModal(false)}
        visible
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        <View style={Styles.mainContainer}>
          <View style={Styles.campaignContainerView}>
            <View style={Styles.headerView}>
              <AppText style={Styles.bodyHeaderText}>Select a Campaign </AppText>
            </View>
            <Separator />
            <View style={Styles.headerPart}>
              <SearchBox
                isIcon
                placeholder="Search by Campaign"
                inputStyle={{fontSize: moderateScale(14)}}
                changeText={(txt) => {
                  setSearchTxt(txt)
                  onChangeCampaignSearch(txt);
                }}
               
                stateValue={searchTxt}
              />
            </View>
            {campdata.length>0?<FlatList
              numColumns={2}
              data={campdata}
              renderItem={renderCampaign}
            />:<AppText style={{margin:15,color:'black',fontSize:14}}>No Campaign Found</AppText>
            }
           {campdata.length>0 ? 
           <ActionContainer
              isContinue
              onPressSave={() => {
                setModal(false);
                if (selectedIndex?.toString()?.length) {
                  setCampaign(true);
                  setindex(campdata[selectedIndex]);
                }
              }}
              onPressCancel={() => setModal(false)}
              continueText="Ok"
              continueStyle={Styles.actionStyle}
              cancelStyle={Styles.actionStyle}
            /> :
            <TouchableOpacity
            onPress={() => setModal(false)}
            style={{  borderRadius: 10,
              borderWidth: 1,width:'26%',marginHorizontal:'37%',position:'absolute',bottom:50,
              paddingVertical: 10,
              paddingHorizontal: 20, borderColor: '#E61818',color: '#E61818'}}
          >
            <AppText style={{ 
      fontSize: 13,
      alignSelf: "center",
      color: '#E61818',}}>
              {"Cancel"}
            </AppText>
          </TouchableOpacity>
            }
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default SelectCampaignModal;

const ModalStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      //   flex: 1,
      height: '100%',
      justifyContent: 'flex-end',
    },
    campaignContainerView: {
      height: '90%',
      backgroundColor: COLORS.white,
    },
    headerView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: moderateScale(10),
    },
    bodyHeaderText: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(10),
      color: COLORS.textColor,
    },
    headerPart: {
      padding: moderateScale(10),
    },
    campaignContainer: active => ({
      margin: moderateScale(5),
      width: '47%',
      borderRadius: moderateScale(5),
      borderWidth: moderateScale(1),
      borderColor: active ? 'red' : '#0000000F',
      overflow: 'hidden',
    }),
    imageStyle: {
      height: moderateScale(100),
      width: '100%',
    },
    videoName: {
      fontSize: moderateScale(12),
      margin: moderateScale(5),
      color: COLORS.textColor,
    },
    dateText: {
      fontSize: moderateScale(10),
      color: COLORS.unselectedText,
      margin: moderateScale(5),
    },
    infoStyle: {
      height: moderateScale(32),
      width: moderateScale(32),
      resizeMode: 'contain',
      position: 'absolute',
      right: moderateScale(0),
    },
    actionStyle: {
      width: '49%',
    },
  });
