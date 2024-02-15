import React, { FC, ReactElement, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
} from 'react-native';
import Feather from "react-native-vector-icons/Feather"
import { useThemeContext } from '../../appConfig/AppContext/themeContext';
import { moderateScale } from '../../Helper/scaling';
import { FONT_FAMILY } from '../../Assets/Fonts/fontNames';
import AppText from '../Atoms/CustomText';

// interface Props {
//   label: string;
//   data: Array<{ label: string; value: string }>;
//   onSelect: (item: { label: string; value: string }) => void;
// }

const DropdownBtn= ({ title,label, data, onSelect,textstyle={} }) => {
    const themeColor=useThemeContext()
    const styles=DropStyles(themeColor)
  const DropdownButton = useRef();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [dropdownTop, setDropdownTop] = useState(0);

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };

  const onItemPress = (item) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({ item,index })=> (
    <TouchableOpacity key={index} style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={[styles.options]}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    return (
      <Modal visible={visible}   transparent={true} animationType="none">
       {/* <ScrollView> */}
        <TouchableOpacity
            style={styles.overlay}
            onPress={() => setVisible(false)}
          >
            
            <View style={[styles.dropdown, { top: dropdownTop }]}>
              <FlatList
                data={data}
                renderItem={(i,index)=>renderItem(i,index)}
                showsVerticalScrollIndicator={true}
                // keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TouchableOpacity>
       {/* </ScrollView> */}
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={[styles.button,textstyle,]}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <View style={{alignItems:"center",flexDirection:'row'}}>
      {title&&<AppText style={{fontSize:14,textAlignVertical:"center"}}>{title}</AppText>}
      <Text style={styles.buttonText}>{(selected && selected.label) || label}</Text>
      <Feather
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="black"
        />
      </View>
      
    </TouchableOpacity>
  );
};

const DropStyles =(COLORS)=> StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-between",
    backgroundColor: "white",
    height: 50,
    zIndex: 1,
    paddingVertical:5,
    paddingHorizontal:10,
    borderWidth:1,
    borderRadius:10,
  },
  buttonText: {
    flex: 1,
    color:"black",
    fontSize: moderateScale (14),
    paddingHorizontal: moderateScale(5),
    margin: moderateScale(0.5),
    backgroundColor: COLORS.backgroundColor,
    fontFamily: FONT_FAMILY .OPEN_SANS_REGULAR,
    // textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: "red",
    // height:"50%",
    // alignSelf:"center",
    width: '100%',
    shadowColor: 'red',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 10 },
    shadowOpacity: 0.5,
  },
  overlay: {
    justifyContent:"center",
    width: '80%',
    // height: '90%',
    paddingVertical:20,
    // backgroundColor:"red"
    },
  item: {
   paddingHorizontal: 10,
    paddingVertical: 3,
    // borderWidth: 1,
    height:moderateScale(40),
    justifyContent:'center',
    fontSize:moderateScale(15),
    borderRadius:10,
    borderColor:"#A9A9A9",
    marginVertical:5,
    marginHorizontal:moderateScale(18)
  },
  options:{
    color:"black"
  }
});

export default DropdownBtn;