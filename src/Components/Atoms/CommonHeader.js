import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import DownArr from "../../Assets/Images/PNG/down_arr.png";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AppText from "./CustomText";
import BulkActionButton from "./BulkActionButton";

const CommonHeaderTitleAction = ({ title = "", titleTextStyle = {},btnOpenModelType=()=>{},currPage=0,totalItemCount=0, renderDelete=false}) => {
  const themeColor = useThemeContext();
  const Styles = HeaderStyle(themeColor);

  const deleteData = (type,id)=>{
    btnOpenModelType(type,id)
  }


  return (
    <View style={Styles.headerView}>
      <View style={Styles.schedulerView}>
        <AppText
          adjustsFontSizeToFit
          style={[Styles.titleStyle, titleTextStyle]}
        >
          {title}
        </AppText>
        {/* <AppText style={Styles.recordsText}>Total Records : 1-10 of {totalItemCount}</AppText> */}
      </View>
      {renderDelete && <BulkActionButton title={title} pageName={title} btnOpenModelType={deleteData}/>}
    </View>
  );
};

export default CommonHeaderTitleAction;

const HeaderStyle = (COLORS) =>
  StyleSheet.create({
    headerView: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      padding: moderateScale(10),
      width: "100%",
    },
    schedulerView: {
      justifyContent: "flex-start",
      marginHorizontal: moderateScale(5),
    },
    recordsText: {
      color: COLORS.lightBlack,
      fontSize: moderateScale(13),
    },
    bulkAction: {
      flexDirection: "row",
      alignItems: "baseline",
      padding: moderateScale(10),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.searchBorder,
    },
    titleStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(18),
      color: COLORS.textColor,
      marginVertical: moderateScale(5),
    },
    innerText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(13),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
    },
    downStyles: {
      height: moderateScale(5),
      width: moderateScale(9),
    },
  });
