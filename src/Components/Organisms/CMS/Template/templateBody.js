import React, { memo } from 'react';
import {FlatList, ScrollView, StyleSheet, View, Image, Pressable} from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EditIcon from '../../../../Assets/Images/PNG/edit.png';
import DeleteIcon from '../../../../Assets/Images/PNG/delete.png';
import {moderateScale} from '../../../../Helper/scaling';
import {useThemeContext} from '../../../../appConfig/AppContext/themeContext';
import AppText from '../../../Atoms/CustomText';
import ThemedText from '../../../Atoms/ThemedText';
import ScheduleScrollHeaderSearch from '../Scheduler/ScheduleScrollHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TemplateHeader from './TemplateHeader';
import { useSelector } from 'react-redux';
import { PREVILAGES } from '../../../../Constants/privilages';

const TemplateBody = ({
  checkboxAll, setCheckboxAll,
  templateList,filterData,
  setFilterData,settemplateList,
  btnSchedularData, 
  handleEditPress, 
  handleDeletePress}) => {
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const { authorization, isApprover } = useSelector((state) => state.userReducer);

  
  const userData = useSelector((state) => state.userReducer.userDetails.data);

  const getBackgroundColor = value => {
    if (value === 'SUBMITTED') {
      return {
        backgroundColor: '#CDEECC',
      };
    }else{
      return {
        backgroundColor: '#FCE9CC',
      };
    }
  };

  const onchange = (type, value) => {
  //  console.log(type, value)
    if (type == "Template Name") {
      setFilterData({ ...filterData, templateName: value });
    } else if (type == "No. Of Regions") {
      setFilterData({ ...filterData, noOfRegions: value });
    } else if (type == "Description") {
      setFilterData({ ...filterData, desc: value });
    } else if (type == "Tags") {
      setFilterData({ ...filterData, tag: value });
    } else if (type == "Created By") {
      setFilterData({ ...filterData, createdBy: value });
    } 
  };

  const btnAllCheckUnchecked = (value) => {
    let planogramList1=[]
     if (value) {
      // planogramList1 = templateList?.map((item, index) => {
      //   return { ...item, checkStatus: true };
      // });
      templateList.forEach((item,i)=>{
        if(item.defaultTemplate==false){
          planogramList1.push({ ...item, checkStatus: true })
        }else{
          planogramList1.push({ ...item, checkStatus: false })
        }
      })
    } else {
      planogramList1 = templateList?.map((item, index) => {
        return { ...item, checkStatus: false };
      });
    }
    const idslenght=planogramList1.filter((item)=>item.checkStatus==true)
    console.log("meneknkdnkd",planogramList1.length,templateList.length,idslenght.length)
    settemplateList([...planogramList1]);
    if(idslenght.length==0){
      setCheckboxAll(false);
    }else{
      setCheckboxAll(true);
    }
   // dispatch(updateSchedulerList({...schedularlist,result:planogramList1}))
  };
  
  const multielectCompaign = (index) => {
    setCheckboxAll(false)
    templateList[index].checkStatus = !templateList[index].checkStatus;
    settemplateList([...templateList]);
   // dispatch(updateSchedulerList({...schedularlist,result:[...schedularlist]}))  

    
  };

  const getTextColor = value => {
    if (value === 'SUBMITTED') {
      return {
        color: '#08AD02',
      };
    }else{
      return {
        color: '#F19100',
      };
    }
  };

  const renderTextView = (value, index) => {
    let textValue = value
    if (textValue === null) {
      textValue = '-'
    }
    return (
      <View style={[Styles.nameView,{width:'14%'} ]}>
        <AppText style={Styles.nameText}>{textValue}</AppText>
      </View>
    );
  };

  const renderDescView = (value, index) => {
    let textValue = value
    if (textValue === null) {
      textValue = '-'
    }
    return (
      <View style={Styles.descView}>
        <AppText style={Styles.nameText}>{textValue}</AppText>
      </View>
    );
  };

  const renderNoView = (value, index) => {
    let textValue = value
    if (textValue === null) {
      textValue = '-'
    }
    return (
      <View style={[Styles.commonView, Styles.numberView]}>
        <AppText style={Styles.commonText}>{textValue}</AppText>
      </View>
    );
  };

  const renderState = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.stateView]}>
        <ThemedText
          title={value}
          containerStyle={[Styles.statusView, getBackgroundColor(value)]}
          textStyles={getTextColor(value)}
        />
        {value === 'Published' && (
          <Foundation name="info" size={25} color={themeColor.themeColor} />
        )}
      </View>
    );
  };

  const renderAction = (item) => {
    const isDelete=item.templateName?item.templateName.search("Default Template"):""
    return (
      <View style={Styles.actionView}>
        {userData.customerType=="ADVANCED"&&(isDelete==-1) && authorization.includes(PREVILAGES.TEMPLATE.DELETE_TEMPLATE) && isApprover ?<TouchableOpacity onPress={()=>handleDeletePress(item)}>
          <View style={Styles.iconBackView}>
            <Image source={DeleteIcon} style={Styles.actionIcons} />
          </View>
        </TouchableOpacity>
        :<AppText style={{color:"#888",fontSize:14}}>Default</AppText>
        }
      </View>
    );
  };

  const renderTemplateItems = ({item, index}) => {
    // const isDelete=item.templateName?item.templateName.search("Default Template"):""
    console.log("template===>",item.templateName,item.defaultTemplate)
    return (
      <View style={Styles.renderContainer}>
         <View style={Styles.iconView}>
         {userData.customerType=="ADVANCED"&&item.defaultTemplate==false?<Pressable
            onPress={() => {
              multielectCompaign(index);
            }}
            style={Styles.iconView}
          >
            {item.checkStatus == false ? (
              <MaterialIcons
                name="check-box-outline-blank"
                color={themeColor.themeColor}
                size={25}
              />
            ) : (
              <MaterialIcons
                name="check-box"
                color={themeColor.themeColor}
                size={25}
              />
            )}
          </Pressable>:<View style={{width:35}}></View>
        }
        </View> 
        <View style={Styles.nameView}>
          <AppText style={Styles.nameText}>{item.templateName}</AppText>
        </View>
        {renderNoView(item.noOfRegion, index)}
        {renderDescView(item.templateDesc, index)}
        {renderTextView(item.layoutTags, index)}
        {renderTextView(item.userName, index)}
        {/* {renderState(item.tempState, index)} */}
        {renderAction(item)}{/* {isDelete==-1?renderAction(item):renderTextView("",5)} */}
      </View>
    );
  };

  return (
    <ScrollView
      horizontal={true}
      style={Styles.mainContainer}
      bounces={false}
      showsHorizontalScrollIndicator={false}>
      <FlatList
        scrollEnabled={false}
        data={templateList}
        renderItem={renderTemplateItems}
        ListHeaderComponent={<TemplateHeader
            checkboxAll={checkboxAll}
            setCheckboxAll={setCheckboxAll}
            filterData={filterData}
            onchange={onchange}
            btnSchedularData={btnSchedularData}
            btnAllCheckUnchecked={btnAllCheckUnchecked}
            />
        }
      />
    </ScrollView>
  );
};

export default memo(TemplateBody);

const scheduleStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.themeLight,
      width: '100%',
    },
    actionView: {
      backgroundColor: 'white',
      width: '14%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      padding: moderateScale(5),
    },
    nameView: {
      width: '18%',
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
    },
    descView: {
      width: '25%',
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
    },
    commonView: {
      width: '20%',
      marginHorizontal: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(8),
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      fontWeight: '400',
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(5),
    },
    renderContainer: {
      flexDirection: 'row',
      width: '100%',
      margin: moderateScale(0.5),
      justifyContent: 'flex-start',
    },
    statusText: {
      fontSize: moderateScale(16),
      fontWeight: '500',
      padding: moderateScale(5),
      paddingHorizontal: moderateScale(20),
    },
    statusView: {
      margin: moderateScale(5),
      paddingVertical: moderateScale(7),
      alignSelf: 'center',
    },
    actionContainer: {
      backgroundColor: 'white',
      width: '12%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    stateView: {alignItems: 'center', width: '18%', flexDirection: 'row'},
    textView: {width: '12%'},
    numberView: {width: '12%',},
    createdBy: {width: '18%'},
    iconBackView: {
      height: moderateScale(35),
      width: moderateScale(35),
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
    nameText:{color: COLORS.textColor,},
    actionIcons: {
      height: moderateScale(20),
      width: moderateScale(20),
      resizeMode: 'contain',
    },
  });
