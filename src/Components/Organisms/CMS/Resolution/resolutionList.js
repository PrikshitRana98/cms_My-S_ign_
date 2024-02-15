import React from 'react';
import {FlatList, Image, ScrollView, StyleSheet, View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FONT_FAMILY} from '../../../../Assets/Fonts/fontNames';
import DeleteIcon from '../../../../Assets/Images/PNG/delete.png';
import EditIcon from '../../../../Assets/Images/PNG/edit.png';
import {moderateScale, width} from '../../../../Helper/scaling';
import {useThemeContext} from '../../../../appConfig/AppContext/themeContext';
import AppText from '../../../Atoms/CustomText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { updateResolutionList } from '../../../../appConfig/Redux/Action/resolutionManagerAction';
import Store from '../../../../appConfig/Redux/store';
import { PREVILAGES } from '../../../../Constants/privilages';
import { useSelector } from 'react-redux';

const {dispatch} = Store;

const resolutionHeadings = [
  'Resolutions',
  'Created By',
  'Actual Width',
  'Actual Height',
  'Aspect Ratio',
  'Action',
];

const ResolutionListView = ({checkAll, setCheckAll,handleEditPress, handleDeletePress, resolutionList,setResolutionData}) => {
  const themeColor = useThemeContext();
  const Styles = ResolutionStyles(themeColor);
  const { authorization } = useSelector((state) => state.userReducer);

  const userData = useSelector((state) => state.userReducer.userDetails.data);
 
  const headerComp = () => {
    const selectAllItems = (selected) =>{
      const data = [...resolutionList];
      // data.map((_, i) =>{
      //     data[i]= {...data[i], selected:selected};
      // })
      // dispatch(updateResolutionList(data));

      data.map((_, i) =>{
          data[i]= {...data[i], checkStatus:selected};
      })
      // checkStatus
      // console.log("------->",data)
      let selectedPlanogramStr = data.filter(
        (item) => (item.checkStatus == true&&item.isEditable)
      );
      let ids = selectedPlanogramStr.map((item) => {
        return item.aspectRatioId;
      });
      console.log("345678654567865",ids)
      if(ids.length>0){
        setResolutionData(data)
      setCheckAll(selected);
      }
    }
    
    return (
      <View style={Styles.headerView}>
        {userData.customerType=="ADVANCED"&& <TouchableOpacity
          style={Styles.iconCenterView}
          onPress={()=>{
            selectAllItems(!checkAll)
          }}>
          <MaterialIcons
            name={(checkAll)?'check-box':"check-box-outline-blank"}
            color={themeColor.themeColor}
            size={25}
          />
        </TouchableOpacity> }
        {resolutionHeadings.map((item, index) => (
          <View key={item + index} style={[Styles.mainContainer(index)]}>
            <AppText style={Styles.boldText}>{item}</AppText>
          </View>
        ))}
      </View>
    );
  };
  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commonView]}>
        <AppText style={Styles.commonText}>{value}</AppText>
      </View>
    );
  };

  const renderAction = (item) => {
    return (
      <View style={Styles.actionView}>
        {authorization?.includes(PREVILAGES.ASPECT_RATIO.EDIT_ASPECT_RATIO) && (
          <TouchableOpacity onPress={() => handleEditPress(item)}>
            <View style={Styles.iconBackView}>
              <Image source={EditIcon} style={Styles.actionIcons} />
            </View>
          </TouchableOpacity>
        )}
        {authorization?.includes(
          PREVILAGES.ASPECT_RATIO.DELETE_ASPECT_RATIO
        ) && (
          <TouchableOpacity onPress={() => handleDeletePress("Delete",item)}>
            <View style={Styles.iconBackView}>
              <Image source={DeleteIcon} style={Styles.actionIcons} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };



  const handleCheckboxClick = (item, index) => {
    setCheckAll(false);
    const data = [...resolutionList];
    if(item?.checkStatus){
      data[index]= {...data[index], checkStatus:false};
    }else{
      data[index]= {...data[index], checkStatus:true};
    }
    // dispatch(updateResolutionList(data));
    setResolutionData(data)

  };

  const RenderResolution = (item, index) => {
    // console.log("index",index,item)
    return (
      <View style={Styles.renderContainer}>
        {item?.isEditable ? 
          <TouchableOpacity
            style={Styles.iconView}
            onPress={() => {
              handleCheckboxClick(item, index)
              }}>
            <MaterialIcons
              name={item?.checkStatus ? 'check-box' : 'check-box-outline-blank'}
              color={themeColor.themeColor}
              size={25}
            />
          </TouchableOpacity> : <View style={Styles.checkBoxView}><Text>-</Text></View>
        }
         <View style={Styles.nameView}>
          <AppText style={Styles.nameText}>
            {/* {item.resolutions} */}
            {item.aspectRatio}
          {" ("}{item.defaultWidthInPixel} x {item.defaultHeightInPixel}{")"}
          </AppText>
        </View>
         <View style={Styles.nameView}>
          <AppText style={Styles.nameText}>{item.createdBy}</AppText>
        </View>
        {renderTextView(item.actualWidthInPixel, index)}
        {renderTextView(item.actualHeightInPixel, index)}
        {renderTextView(item.aspectRatio, index)} 
        {item?.isEditable ? renderAction(item) : <View style={Styles.actionView}><AppText style={{fontSize:13,color:"#8888"}}>{item.defaultAspectRatio?"Default":""}</AppText></View>}
      </View>
    );
  };

  return (
    <ScrollView
      bounces={false}
      horizontal={true}
      style={Styles.bodyContainer}
      showsHorizontalScrollIndicator={false}>
      <View>
        <FlatList
          data={resolutionList}
          renderItem={({item,index})=>
          // <RenderResolution item={item} index={index}/>
          RenderResolution(item,index)
        }
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={headerComp}
          style={Styles.containerView}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};
export default ResolutionListView;

const ResolutionStyles = COLORS =>
  StyleSheet.create({
    bodyContainer: {
      marginVertical: moderateScale(10),
      width: '100%',
    },
    mainContainer: index => ({
      paddingHorizontal: moderateScale(5),
      justifyContent: 'center',
      marginHorizontal: moderateScale(2),
      width: index === 0 || index === 1 ? '20%' : '14%',
      alignItems: 'center',
    }),
    headerView: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: moderateScale(width * 2.5),
      padding: moderateScale(10),
      marginVertical: moderateScale(1),
      backgroundColor: COLORS.themeLight,
    },
    boldText: {
      fontSize: moderateScale(16),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    renderContainer: {
      flexDirection: 'row',
      width: '100%',
      margin: moderateScale(0.5),
    },
    iconView: {
      width: '100%',
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(10),
    },
    checkBoxView: {
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(19),
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    commonView: {
      width: '14%',
      margin: moderateScale(1),
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      alignItems: 'center',
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    actionView: {
      backgroundColor: 'white',
      width: '14%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      padding: moderateScale(5),
    },
    nameView: {
      width: '19%',
      margin: 0.5,
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      alignItems: 'center',
    },
    iconBackView: {
      height: moderateScale(32),
      width: moderateScale(32),
      borderRadius: moderateScale(17),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(5),
      marginHorizontal: moderateScale(5),
    },
    actionIcons: {
      height: moderateScale(20),
      width: moderateScale(20),
      resizeMode: 'contain',
    },
  });
