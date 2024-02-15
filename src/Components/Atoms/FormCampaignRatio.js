import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { moderateScale } from "../../Helper/scaling";
import { useSelector } from "react-redux";
import ModalDropdownComp from "./DropDown";

const FormCampaignRatio = ({ title, option, style, styleContainer }) => {
 
  const dropdownCategoryref = useRef();
  const [showFeather, setShowFeather] = useState(false);
  const [selectedOption, setSelectedOption] = useState(title); // Initialize with the title prop

  useEffect(() => {
    setSelectedOption(title);
  }, [title]);

  return (
    <View>
      <ModalDropdownComp
        options={option}
        ref={dropdownCategoryref}
        onClose={() => setShowFeather(false)}
        keySearchObject="name"
        renderRow={(props) => {
          return (
            <Text
              style={[
                {textAlign: "center", marginTop: 3, fontSize:18},
              ]}
            >
              {props}
            </Text>
          );
        }}
        dropdownStyle={[Styles.dropdownContainer, style]}
        renderSeparator={(obj) => null}
        onSelect={(index, selectedValue) => {
          setSelectedOption(selectedValue);
        }}
      >
        <TouchableOpacity
          style={[Styles.bulkAction, styleContainer]}
          onPress={() => {
            setShowFeather(true);
            dropdownCategoryref.current._onButtonPress();
          }}
        >
          <Text style={Styles.selectedOption}>{selectedOption}</Text>
          <Feather name={"chevron-up"} size={20} color="black" />
        </TouchableOpacity>
      </ModalDropdownComp>
    </View>
  );
};

const Styles = StyleSheet.create({
  bulkAction: {
     flexDirection: "row",
     justifyContent: "space-between",
    width: '100%',
    borderWidth: 1,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#00000026',
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(15),
  },
  dropdownContainer: {
    position: "absolute",
    backgroundColor: "#FFF",
    width: '90%',
    borderWidth: 1,
    // height: "auto",
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#00000026',
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(15),
  },
  selectedOption:{
    fontSize:18
  },
  dropdownOption: {
    paddingVertical: 8,
    textAlign: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  innerText: {
    fontSize: moderateScale(12),
    color: "#000000",
  },
});

export default FormCampaignRatio;
