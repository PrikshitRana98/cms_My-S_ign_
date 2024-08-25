import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { moderateScale } from "../../Helper/scaling";
import DownIcon from "../../Assets/Images/PNG/download.png";
import { useSelector } from "react-redux";
import { PREVILAGES } from "../../Constants/privilages";

const MediaActions = ({
  showall,
  header,
  mediaType,
  iconContainerStyle = {},
  containerStyle = {},
  handleDeletePress,
  handleEditPress,
  handleViewMedia,
  handleContentEdit,
  handleArchive,
}) => {
  const themeColor = useThemeContext();
  const Styles = IconStyles(themeColor);
  const { authorization } = useSelector((state) => state.userReducer);

  const onClick = () => {
    // Call the callback function
    handleDeletePress();
  };

  const deleteIcon = require("../../Assets/Images/PNG/delete.png");

  return (
    <View style={[Styles.iconBackContainer, containerStyle]}>
      {authorization.includes(PREVILAGES.MEDIA.VIEW_MEDIA) &&
        (mediaType === "IMAGE" ||
          mediaType === "VIDEO" ||
          mediaType === "AUDIO" ||
          mediaType === "PDF" ||
          mediaType === "PPT") && (
          <TouchableOpacity
            onPress={() => handleViewMedia()}
            style={[Styles.iconBackView, iconContainerStyle]}
          >
            <Ionicons name="eye" size={20} color={themeColor.themeColor} />
          </TouchableOpacity>
        )}

      {header != "Archived" &&
        (mediaType === "IMAGE" ||
          mediaType === "VIDEO" ||
          mediaType === "AUDIO" ||
          mediaType === "PDF" ||
          mediaType === "PPT") &&
        authorization.includes(PREVILAGES.MEDIA.EDIT_MEDIA) && (
          <TouchableOpacity
            onPress={() => handleEditPress()}
            style={[Styles.iconBackView, iconContainerStyle]}
          >
            <Feather name="edit" size={18} color={themeColor.themeColor} />
          </TouchableOpacity>
        )}

      {header != "Archived" && (
        <>
          {(mediaType === "TEXT" ||
            mediaType === "HTML" ||
            mediaType === "FACEBOOK" ||
            mediaType === "TWITTER" ||
            mediaType === "URL" ||
            mediaType === "STREAM_URL" ||
            mediaType === "RSS")&&
            authorization.includes(PREVILAGES.MEDIA.EDIT_MEDIA) 
             && (
            <TouchableOpacity
              onPress={() => handleContentEdit()}
              style={[Styles.iconBackView, iconContainerStyle]}
            >
              <MaterialCommunityIcons
                name="lead-pencil"
                size={20}
                color={themeColor.themeColor}
              />
            </TouchableOpacity>
          )}
        </>
      )}

      {authorization.includes(PREVILAGES.MEDIA.DELETE_MEDIA) && (
        <TouchableOpacity
          onPress={() => onClick()}
          style={[Styles.iconBackView, iconContainerStyle]}
        >
          <Image
            source={deleteIcon}
            style={{
              height: moderateScale(20),
              width: moderateScale(20),
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => handleArchive()}
        style={[Styles.iconBackView, iconContainerStyle]}
      >
        <MaterialIcons
          name={header == "Archived" ? "unarchive" : "archive"}
          size={20}
          color={themeColor.themeColor}
        />
        {/* <Image
          source={DownIcon}
          style={{
            height: moderateScale(15),
            width: moderateScale(15),
            tintColor: themeColor.themeColor,
          }}
        /> */}
      </TouchableOpacity>
    </View>
  );
};

export default MediaActions;

const IconStyles = (COLORS) =>
  StyleSheet.create({
    iconBackView: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: moderateScale(14),
      backgroundColor: COLORS.backgroundColor,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(5),
    },
    iconBackContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(2),
    },
  });
