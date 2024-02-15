import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import CustomIconTextValue from "../Atoms/IconTextValue";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomeIcon from "../../Assets/Images/PNG/home_icon.png";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { useSelector } from "react-redux";

const getIcon = (locId,isChecked, themeColor, onClick = () => {},isCheckedIconShow) => {
  const userlocation= useSelector((state)=>state.userReducer.userRole.locations)
  const userLocId=userlocation.map((ele,i)=>{return ele.locationId});
  
  const checkIdExist=(id)=>{
    if(userLocId.length==0){
      return true;
    }
    return userLocId.includes(id)
  }
  if(isCheckedIconShow){
    return <TouchableOpacity onPress={() => {console.log("onClick()",locId);
    if(checkIdExist(locId)){
      onClick()
    }
    }}>
    {checkIdExist(locId)&&
       <>{isChecked ? (
            <Ionicons name="checkbox" size={25} color={themeColor.themeColor} />
          ) : (
            <MaterialIcons
              name="check-box-outline-blank"
              color={themeColor.themeColor}
              size={24}
            />
          )} 
       </>
     }
  </TouchableOpacity>
  }else{
    return false;
  }
}

export const LocationBrandContainer = ({
  title = "",
  count,
  locId,
  isChevronUp = true,
  onPressArrow = () => {},
  isChecked, 
  isCheckedIconShow,
  onClickChecked
}) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  return (
    <CustomIconTextValue
      icon={() =>getIcon(locId,isChecked, themeColor, onClickChecked,isCheckedIconShow)}
      name={title}
    
      isChevron={true}
      isChevronUp={isChevronUp}
      isChecked={true}
      iconNameContainerStyle={Styles.baseLineContainer}
      onPressArrow={onPressArrow}
    />
  );
};
export const LocationCountryContainer = ({
  isChecked = true,
  locId,
  isChevronUp = true,
  isCheckedIconShow,
  count = {},
  onPressArrow = () => {},
  onClickChecked = () => {},
  title = "",
}) => {
  const themeColor = useThemeContext();

  return (
    <CustomIconTextValue
      icon={() => getIcon(locId,isChecked, themeColor, onClickChecked,isCheckedIconShow)}
      name={title}
      isChevron={true}
      isChevronUp={isChevronUp}
      isTextBold={false}
      isChecked={true}
      onPressArrow={onPressArrow}
    />
  );
};

export const LocationStateContainer = ({
  isChecked,
  locId,
  isChevronUp = true,
  count = {},
  isCheckedIconShow,
  onClickChecked = () => {},
  onPressArrow = () => {},
  isChevron=true,
  title = "",
}) => {
  const themeColor = useThemeContext();

  return (
    <CustomIconTextValue
      icon={() => getIcon(locId,isChecked,themeColor, onClickChecked,isCheckedIconShow)}
      name={title}
    
      isChevron={isChevron}
      isChevronUp={isChevronUp}
      isTextBold={false}
      isChecked={true}
      containerStyle={{
        paddingLeft: moderateScale(25),
      }}
      onPressArrow={onPressArrow}
    />
  );
};

export const LocationCityContainer = ({
  isChecked = false,
  locId,
  isChevron = false,
  isChevronUp = true,
  isCheckedIconShow,
  count = {},
  onPressArrow = () => {},
  onClickChecked = () => {},
  title = "",
}) => {
  const themeColor = useThemeContext();
  return (
    <CustomIconTextValue
      icon={() => getIcon(locId,isChecked, themeColor, onClickChecked,isCheckedIconShow)}
      name={title}
    
      isChevron={isChevron}
      isChevronUp={isChevronUp}
      isTextBold={false}
      isChecked={true}
      containerStyle={{
        paddingLeft: moderateScale(40),
      }}
      onPressArrow={onPressArrow}
    />
  );
};

const CommonStyles = (COLORS) =>
  StyleSheet.create({
    baseLineContainer: {
      alignItems: "baseline",
    },
  });
