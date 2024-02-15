
import React,{useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View,TextInput,Pressable} from 'react-native';
import UpDownArr from '../../../../Assets/Images/PNG/updown.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {moderateScale, width} from '../../../../Helper/scaling';
import {useThemeContext} from '../../../../appConfig/AppContext/themeContext';
import SearchBox from '../../../Atoms/SearchBox';
import HeaderSearch from '../../../Atoms/HeaderSearch';
import {FONT_FAMILY} from '../../../../Assets/Fonts/fontNames';
import { useSelector } from 'react-redux';
const headerData = [
  'Template Name',
  'No. Of Regions',
  'Description',
  'Tags',
  'Created By',  
  'Action',
];

const TemplateHeader = ({onchange,checkboxAll,setCheckboxAll, filterData,btnSchedularData,btnAllCheckUnchecked}) => {
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const regEx = new RegExp('[ /]');
  const userData = useSelector((state) => state.userReducer.userDetails.data);
//   const [checkboxAll, setCheckboxAll] = useState(false);
  
//   useEffect(()=>{
//     setCheckboxAll(checkbox)
//   },[checkbox])noOfRegions:"",
  
  const returnValue = (value) => {
    switch (value) {
      case "Template Name":
        return filterData?.templateName;
        break;
      case "No. Of Regions":
        return filterData?.noOfRegions;
        break;
      case "Description":
        return filterData?.desc;
        break;
      case "Tags":
        return filterData?.tag;
        break;
      case "Created By":
        return filterData?.createdBy;
        break;  
      default:
        break;
    }
  };
  return (
    <View style={Styles.headerView}>
        <View style={Styles.iconCenterView}>
      {userData.customerType=="ADVANCED"&&<Pressable
        onPress={() => {
          btnAllCheckUnchecked(!checkboxAll);
          // setCheckboxAll(!checkboxAll);
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
      </Pressable>}
       
      </View>
      {headerData?.map((item, index) => {
        return (
          <View key={item + index} style={[Styles.mainContainer(index)]}>
            <View style={Styles.headerContainer}>
              <Text style={Styles.boldText}>{item}</Text>
               {/* {(index == 0 || index == 1 || index == 3 ) && (
                <Image source={UpDownArr} style={Styles.arrowStyle} />
              )} */}
            </View>
            {(index <headerData.length-1) &&
            <View style={[Styles.textcontainer]}>
            <TextInput
              numberOfLines={1}
              style={[Styles.textInputStyle]}
              placeholder={`Search by ${item}`}
              placeholderTextColor={"#00000026"}
              value={returnValue(item)}
              onSubmitEditing={(e) => {
                btnSchedularData();
              }}
              onChangeText={(value) => {
                // console.log(value)
                btnSchedularData();
                onchange(item, value);
              }}
            />
          </View>
            }
          </View>
        );
      })}
    </View>
  );
};

export default TemplateHeader;

const scheduleStyles = COLORS =>
  StyleSheet.create({
    mainContainer: index => ({
      paddingHorizontal: moderateScale(5),
      justifyContent: 'center',
      marginHorizontal: moderateScale(2),
      maxWidth:"60%",
      width: index === 0 ? '19%' : index === 1 ? '12%' : index === 2 ? '25%' : index === 3 ? '14%' : index === 4 ? '14%' :index === 5 ? '10%' : '0%',
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
      color:'black'
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
