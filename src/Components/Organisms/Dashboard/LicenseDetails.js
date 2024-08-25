import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {FONT_FAMILY} from '../../../Assets/Fonts/fontNames';
import {moderateScale} from '../../../Helper/scaling';
import {useThemeContext} from '../../../appConfig/AppContext/themeContext';
import AppText from '../../Atoms/CustomText';

const LicenseDetails = ({licenseDetails={},userList,userActive,activeSideCount}) => {
  const themeColor = useThemeContext();
  const Styles = licensesStyles(themeColor);
  // console.log(userList,"abcd")

  // const [licenseData, setLicenseData] = useState({});

  // const success = res => {
  //   setLicenseData(res?.result);
  // };

  // const failure = err => {
  //   console.log(err.response);
  // };

  // const getLocationDetails = async () => {
  //   const token = await getStorageForKey('authToken');
  //   console.log('token', token);
  //   axios
  //     .get('http://3.109.227.48:9001/dashboard/customer', {
  //       headers: {
  //         Authorization: 'Bearer ' + token,
  //       },
  //     })
  //     .then(response => setLicenseData(response?.data?.result))
  //     .catch(error => console.log(error));
  // };

  useEffect(() => {
    // AuthenticationService.fetchCustomer(null, success, failure);
    // getLocationDetails();
  }, []);

  const dataObject = [
      {
        color: themeColor.lavenderBackground,
        path: require('../../../Assets/Images/PNG/blu_doc.png'),
        text: 'Total Licenses',
        value:   (licenseDetails?.availableLicense + licenseDetails?.usedLicense) || 0,
      },
      {
        color: themeColor.greenBackground,
        path: require('../../../Assets/Images/PNG/green_doc.png'),
        text: 'Available Licenses',
        value: licenseDetails?.availableLicense ||  0,
      },
      {
        color: themeColor.redBackground,
        path: require('../../../Assets/Images/PNG/red_doc.png'),
        text: 'Consumed Licenses',
        value:  licenseDetails?.usedLicense || 0,
      },
      {
        color: themeColor.yellowBackground,
        path: require('../../../Assets/Images/PNG/locations.png'),
        text: 'Active Sites',
        value: activeSideCount || 0,
      },
  
  ]


  const renderCampaign = ({item}) => {
   return(
    <View style={Styles.subContainer}>
      <View style={Styles.textIconView}>
      <AppText style={Styles.textStyles}>
       {item.value}
      </AppText>
      <View
            style={[
              Styles.iconView,
             
            ]}>
            <Image
              source={item.path}
              style={Styles.docStyle}
            />
          </View>
      </View>

          <AppText
          adjustsFontSizeToFit
          numberOfLines={1}
          style={Styles.licenseText}>
          {item.text}
        </AppText>
    </View>
   )
  }

  return (
    <View style={Styles.mainContainer}>
      <FlatList
       numColumns={2}
       data={dataObject}
       renderItem={renderCampaign}
      />
     
    </View>
  );
};

export default LicenseDetails;

const licensesStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    subContainer: {
      width: '46.5%',
      borderWidth: moderateScale(1),
      borderRadius: moderateScale(3),
      borderColor: COLORS.cardBorder,
      marginVertical: moderateScale(10),
      padding: moderateScale(10),
      justifyContent: "space-around",
      backgroundColor: COLORS.white,
      alignItems:"center",
      marginHorizontal: moderateScale(5),

    },
    textIconView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    textStyles: {
      fontSize: moderateScale(28),
      fontWeight: '700',
      color: COLORS.textColor,
    },
    iconView: {
      width: moderateScale(50),
      height: moderateScale(50),
      borderRadius: moderateScale(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
    licenseText: {
      fontSize: moderateScale(15),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      width: '100%',
    },
    docStyle: {
      height: moderateScale(26),
      width: moderateScale(26),
    },
  });
