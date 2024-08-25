
import React,{useState} from 'react';
import {Image, StyleSheet, Text, View,TextInput,Pressable,TouchableOpacity, Alert} from 'react-native';
import UpDownArr from '../../../../Assets/Images/PNG/updown.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {moderateScale, width} from '../../../../Helper/scaling';
import {useThemeContext} from '../../../../appConfig/AppContext/themeContext';
import SearchBox from '../../../Atoms/SearchBox';
import HeaderSearch from '../../../Atoms/HeaderSearch';
import {FONT_FAMILY} from '../../../../Assets/Fonts/fontNames';

const headerData = [
  'Scheduler Name',
  'Created By',
  'Date & Time',
  'Approved / Rejected By',
  'Created On',
  'State',
  'Running / Not Running',
  'Action',
];

const ScheduleScrollHeaderSearch = ({onchange,approval, filterData,btnSchedularData,btnAllCheckUnchecked,onarrowclick}) => {
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const regEx = new RegExp('[ /]');
  const [checkboxAll, setCheckboxAll] = useState(false);
  
  const returnValue = (value) => {
    switch (value) {
      case "Scheduler Name":
        return filterData?.PlanogramName;
        break;
      case "Created By":
        return filterData?.CreatedBy;
        break;
      default:
        break;
    }
  };


  return (
    <View style={Styles.headerView}>
        <View style={Styles.iconCenterView}>
      <Pressable
        onPress={() => {
          btnAllCheckUnchecked(!checkboxAll);
          setCheckboxAll(!checkboxAll);
        }}
        style={Styles.iconCenterView}
      >
        {checkboxAll == false ? (
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
      </Pressable>
       
      </View>
      {headerData?.map((item, index) => {
         if(index === 3 && approval === false)
         return null;
         return ( 
          <View key={item + index} style={[Styles.mainContainer(index),
            { width: approval ? (index === 0 ? '12%' : index === 1 ? '12.5%' : index === 2 ? '15%' : index === 3 ? '12%' : index === 4 ? '12%' :index === 5 ? '10.5%' : index === 6 ?'10%' :'15%') : 
            (index === 0 ? '15%' : index === 1 ? '12.5%' : index === 2 ? '20%' : index === 3 ? '12%' : index === 4 ? '12%' :index === 5 ? '10.5%' : index === 6 ?'9%' :'22%'),
        }]}>
               <View style={Styles.headerContainer}>
                 <Text style={Styles.boldText}>{item}</Text>
                  {(index == 0 || index == 4 ) && (
                  <TouchableOpacity style={{height:30,width:30,justifyContent:'center',alignItems:'center'}}  onPress={() => {
                    onarrowclick(item); 
               
                  }}>
                 <Image source={UpDownArr} style={Styles.arrowStyle} />
                  </TouchableOpacity>
                  
                )}
              </View>
              {(index == 0 || index == 1 ||index == 3) &&
              <View style={[Styles.textcontainer]}>
              <TextInput
                style={[Styles.textInputStyle]}
                placeholder={`Search by ${(index == 0 || index == 3) ? 'Name':item.split(regEx)[0]}`}
                placeholderTextColor={themeColor.placeHolder}
                value={returnValue(item)}
                onSubmitEditing={(e) => {
                  btnSchedularData();
                }}
                onChangeText={(value) => {
                  onchange(item, value);
                }}
              />
            </View>
              }
            </View>
         )
     
      })}
    </View>
  );
};

export default ScheduleScrollHeaderSearch;

const scheduleStyles = COLORS =>
  StyleSheet.create({
    mainContainer: index => ({
      paddingHorizontal: moderateScale(5),
      justifyContent: 'center',
      marginHorizontal: moderateScale(2),
     }),
    headerContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: moderateScale(5),
      height: moderateScale(50),
      width: '100%',
      paddingHorizontal: moderateScale(10),
    },
    iconView: {
      backgroundColor: COLORS.white,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    boldText: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    searchView: {
      marginHorizontal: moderateScale(10),
      width: '90%',
      height: moderateScale(45),
    },
    alignIcon: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    renderContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconCenterView: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    textcontainer: {
      width: "97%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      flexDirection: "row",
      alignItems: "center",
    },
    textInputStyle: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: moderateScale(8),
      width: "100%",
      color:COLORS.textColor
    },
    headerView: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: moderateScale(width * 3.5),
      padding: moderateScale(10),
      marginVertical: moderateScale(1),
    },
    arrowStyle: {
      height: moderateScale(16),
      width: moderateScale(8),
      tintColor: COLORS.themeColor,
      resizeMode: 'contain',
    },
  });