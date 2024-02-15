import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Platform, Button, TouchableOpacity} from 'react-native';
import {useThemeContext} from '../../../../appConfig/AppContext/themeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {moderateScale, width} from '../../../../Helper/scaling';
import AppText from '../../../Atoms/CustomText';
import {FONT_FAMILY} from '../../../../Assets/Fonts/fontNames';
import SearchBox from '../../../Atoms/SearchBox';
import DatePicker from 'react-native-date-picker';
import AppTextInput from '../../../Atoms/AppTextInputs';
import { getArchivedList, getMediaLibData } from '../../../../Services/AxiosService/ApiService';


const MediaListHeader = [
  'Content Name',
  'Duration',
  'Tags',
  'Uploaded By',
  'Uploaded Date',
  'Action',
];
const MediaScrollHeader = ({setIsLoading}) => {
  const themeColor = useThemeContext();
  const Styles = HeaderStyles(themeColor);
  const [date, setDate] = useState("")
  const [open, setOpen] = useState(false)

  const [srchState,setSrchState]=useState({
    'Content':"",
    'Duration':"",
    'Tags':"",
    'UploadedBy':"",
    "UploadedDate":"",
  })

  const call_getApi=()=>{
    const params={
      currentPage:1,
      pageSize:30,
      isArchive:false,
      mediaName:srchState.Content,
      uploadedBy:srchState.UploadedBy,
      tag:srchState.Tags,
      duration:srchState.Duration,
      uploadedDate: srchState.UploadedDate,
    }
    // getArchivedList(setIsLoading,params)
    getMediaLibData(setIsLoading,params);
  }
  useEffect(()=>{
    // srchState.Content.length>3&&call_getApi()
    console.log(srchState)
  },[srchState.Content])


  

 
  const renderInput=(item,index,state,setState)=>{
    return(
      <View  style={[Styles.mainContainer(index)]}>
        <View style={Styles.headerContainer}>
          <AppText style={Styles.boldText}>{item}</AppText>
        </View>
        
        {/* <SearchBox
          stateValue={state}
          placeholder={`Search by ${item}`}
          containerStyle={Styles.searchView}
          inputStyle={{
            fontSize: moderateScale(13),
            paddingVertical: Platform.OS === 'ios' ? 10 : 5,
          }} */}
          <View style={[Styles.container, Styles.searchView]}>
            <AppTextInput
              value={date}
              placeholder={`Search by ${item}`}
              onChangeText={(e)=>e}
              // handleOnSubmitEditing={call_getApi}
              placeholderTextColor={"#00000026"}
              textInputStyle={[Styles.textInputStyle, {
                fontSize: moderateScale(13),
                paddingVertical: Platform.OS === 'ios' ? 10 : 5,
              }]}
              containerStyle={{
                width: '70%',
                marginHorizontal: moderateScale(5),
              }}
            />
      </View>
        
        </View>
    )
  }
  return (
    <View style={Styles.headerView}>
      <View style={Styles.iconCenterView}>
        <MaterialIcons
          name="check-box-outline-blank"
          color={themeColor.themeColor}
          size={25}
        />
      </View>
      {renderInput("Content Name",0,srchState.Content,setState=(e)=>setSrchState({...srchState,Content:e}))}
      {renderInput("Duration",1,srchState.Duration,setState=(e)=>setSrchState({...srchState,Duration:e}))}
      {renderInput("Tags",2,srchState.Tags,setState=(e)=>setSrchState({...srchState,Tags:e}))}
      {renderInput("UploadedBy",3,srchState.UploadedBy,setState=(e)=>setSrchState({...srchState,UploadedBy:e}))}
      <View  style={[Styles.mainContainer(4)]}>
        <View style={Styles.headerContainer}>
          <AppText style={Styles.boldText}>Uploaded Date</AppText>
        </View>
        
        <TouchableOpacity 
        style={{
        justifyContent:"center",
        borderRadius:5,
        backgroundColor:themeColor.white,
        height:50}} 
        onPress={() => {
          // setOpen(true)
          console.log(srchState)
          call_getApi()
        }} >
        <Text style={[Styles.textInputStyle,{fontSize:moderateScale(13),color:"#00000026"}]}> {date?date.toLocaleDateString():"Search By Date"}</Text>
        </TouchableOpacity>
        {/* <DatePicker 
          modal
          mode="date"                    
          open={open}
          date={date}
          maximumDate={new Date()}
          onConfirm={(date) => {
            setOpen(false)
            setDate(date)
            setSrchState({...srchState,UploadedDate:new Date(date).getTime()})
            // console.log(new Date(date).getTime())
          }}
          onCancel={() => {
            setOpen(false)
          }}
      />
             */}
              
          </View>
    </View>
  );
};

export default MediaScrollHeader;

const HeaderStyles = COLORS =>
  StyleSheet.create({
    headerView: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: moderateScale(width * 3.5),
      padding: moderateScale(10),
      marginVertical: moderateScale(1),
    },
    iconCenterView: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    container: {
      width: '100%',
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    mainContainer: index => ({
      paddingHorizontal: moderateScale(5),
      justifyContent: 'center',
      paddingVertical: 10,
      marginHorizontal: moderateScale(2),
      width:
        index === 0 || index === MediaListHeader.length - 1 ? '20%' : '15%',
    }),
    headerContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: moderateScale(50),
    },

    textInputStyle: {
      fontSize: moderateScale(18),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: Platform.OS === 'ios' ? moderateScale(10) : undefined,
    },

    boldText: {
      fontSize: moderateScale(16),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    searchView: {marginHorizontal: moderateScale(10), width: '90%'},
  });
