import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import CustomIconTextValue from "../Atoms/IconTextValue";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomeIcon from "../../Assets/Images/PNG/home_icon.png";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { useSelector } from "react-redux";

const getIcon = (locId,isChecked, themeColor, onClick = () => {}) => {
  const userlocation= useSelector((state)=>state.userReducer.userRole.locations)
  const userLocId=userlocation.map((ele,i)=>{return ele.locationId});
  const checkIdExist=(id)=>{
    if(userLocId.length==0){
      return true;
    }
    return userLocId.includes(id)
  }

  return(<TouchableOpacity 
    onPress={() => {
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
)};










export const LocationBrandContainer = ({
  locId,
  title = "",
  count,
  isChevronUp = true,
  onPressArrow = () => {},
  isChecked, 
  onClickChecked
}) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);
  // const getHomeIcon = () => (
  //   <Image
  //     source={HomeIcon}
  //     style={{
  //       height: moderateScale(23),
  //       width: moderateScale(23),
  //     }}
  //   />
  // );
  return (
    <CustomIconTextValue
      icon={() =>getIcon(locId,isChecked, themeColor, onClickChecked)}
      name={title}
      high={count.high}
      low={count.low}
      isChevron={true}
      isChevronUp={isChevronUp}
      isChecked={true}
      iconNameContainerStyle={Styles.baseLineContainer}
      onPressArrow={onPressArrow}
    />
  );
};
export const LocationCountryContainer = ({
  locId,
  isChecked = true,
  isChevronUp = true,
  count = {},
  onPressArrow = () => {},
  onClickChecked = () => {},
  title = "",
}) => {
  const themeColor = useThemeContext();
  return (
    <CustomIconTextValue
      
      icon={() => getIcon(locId,isChecked, themeColor, onClickChecked)}
      name={title}
      high={count.high}
      low={count.low}
      isChevron={true}
      isChevronUp={isChevronUp}
      isTextBold={false}
      isChecked={true}
      onPressArrow={onPressArrow}
    />
  );
};

export const LocationStateContainer = ({
  locId,
  isChecked,
  isChevronUp = true,
  isChevron = true,
  count = {},
  onClickChecked = () => {},
  onPressArrow = () => {},
  title = "",
}) => {
  const themeColor = useThemeContext();
  return (
    <CustomIconTextValue
      icon={() => getIcon(locId,isChecked, themeColor, onClickChecked)}
      name={title}
      high={count.high}
      low={count.low}
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
  locId,
  isChecked = false,
  isChevron = false,
  isChevronUp = true,
  count = {},
  onPressArrow = () => {},
  onClickChecked = () => {},
  title = "",
}) => {
  const themeColor = useThemeContext();
  return (
    <CustomIconTextValue
      icon={() => getIcon(locId,isChecked, themeColor, onClickChecked)}
      name={title}
      high={count.high}
      low={count.low}
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
