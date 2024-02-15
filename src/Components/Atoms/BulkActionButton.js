import React, { useState ,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {moderateScale} from '../../Helper/scaling';
import { useSelector } from 'react-redux';
import ModalDropdownComp from './DropDown';
import { bulkDeleteResolutionData } from '../../Services/AxiosService/ApiService';
import { FONT_FAMILY } from '../../Assets/Fonts/fontNames';


const BulkAction = ({title,pageName="",btnOpenModelType=()=>{}}) => {
  const resolutionList = useSelector(state => state.ResolutionReducer.resolutionList)
  const dropdownCategoryref = useRef();
  const [showFeather, setShowFeather] = useState(false)

  const deleteAction = () => {
    console.log("deleteAction",pageName);
    if(pageName=='Campaign String'||pageName=='Media Library'||pageName=="Template Management"||pageName=='Scheduler' || pageName=='Planogram' || pageName=='Campaign Management' || pageName=="Media Player Groups" || pageName=="All Devices"||pageName=='Resolution Management'){
    btnOpenModelType('DeleteAll',0)
   }
  //  else if(pageName=='Resolution Management')
  //  { 
  //   const selectedItems = resolutionList.filter(item => item?.selected === true && item?.isEditable === true)
  //   const selectedIds = selectedItems.map(item => item?.aspectRatioId);
  //   const selectedResolutions = selectedItems.map(item => item?.resolutions);

  //   if(selectedIds.length>0){
  //     const params = {aspectRatioIds: selectedIds}
  
  //     Alert.alert('Warning!', `Are you sure you want to delete selected resolution.`, [
  //       {
  //         text: 'Take me back',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {text: 'Sure', onPress: () => {
  //         const success=async(resp)=>{
  //           btnOpenModelType('DeleteAll',0)
  //         }
  //         const faliure=(e)=>{
  //           console.log(e)
  //         }
  //         bulkDeleteResolutionData(params,success,faliure);
  //       }},
  //     ]);
  //   }else{
  //     Alert.alert("Warning","Please select the data")
  //   }
  // }
  }

  const handleOptionSelect = (option) => {
    console.log("handleOptionSelect",option);
    switch (option) {
      case 'Delete':
        deleteAction();
        break;
    }
  };

  return (
    <View>
      <ModalDropdownComp
           onSelect={(_,res2) => {
            handleOptionSelect(res2);
        }}
        options={["Delete"]}
        isFullWidth
        popupHeight={moderateScale(45)}
        ref={dropdownCategoryref}

        onClose={() =>setShowFeather(false)}
        keySearchObject="name"
        renderRow={(props) => {
          return <View style={{borderWidth:2,borderColor:"grey",margin:5,borderRadius:5}}>
          <Text style={[Styles.textStyle,{textAlign:"center",marginVertical:5}]}>{props}</Text>
        </View>;
        }}
        dropdownStyle={{width:100}}
        renderSeparator={(obj) => null}
      >
      <TouchableOpacity
        style={Styles.bulkAction}
        onPress={()=>{
          setShowFeather(true)
          dropdownCategoryref.current._onButtonPress()}}
      >
        <Text style={Styles.textStyle}>Bulk Action</Text>
        <Feather
          name={!showFeather ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="black"
        />
      </TouchableOpacity>
      </ModalDropdownComp>
    </View>
  );
};

const Styles = StyleSheet.create({
  bulkAction: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: 'gray',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#F3F5F8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: 'gray',
    width: '100%',
    top: '100%',
  },
  dropdownOption: {
    paddingVertical: 8,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  textStyle:{
    color:"black",
  textAlignVertical:"center",
  fontSize:moderateScale(14),
  fontFamily:FONT_FAMILY.OPEN_SANS_BOLD
},
  innerText: {
    fontSize: moderateScale(12),
    color: '#000000',
  }
});

export default BulkAction;