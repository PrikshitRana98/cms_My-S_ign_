import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { moderateScale } from "../../../Helper/scaling";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import {
  LocationBrandContainer,
  LocationCityContainer,
  LocationCountryContainer,
  LocationStateContainer,
} from "../../Molecules/LocationBrandViewRegDevice";
import { getStorageForKey } from "../../../Services/Storage/asyncStorage";
import {
  PlanogramManagerService,
  getDeviceGroupByLocation,
} from "../../../screens/Planogram/PlonogramApi";
import { LocationChildContainer } from "../../Molecules/LocationBrandViewDash";

const LocationsForCampaign = ({
  data = null,
  selectedLocations,
  setSelectedLocations,
  locationSelected=[],
  setLocationSelected,
  setIsLoading = () => {},
}) => {
  const themeColor = useThemeContext();
  const Styles = LocationStyles(themeColor);
  // const [viewing, setViewing] = useState({ country: 'India', state: null });
  const [viewing, setViewing] = useState({ 
    country: null, 
    state: null,
    city:null,
    cityChild:null,
    rootId:0 });

  const getIsCheckedRoot = (id) => {
    return selectedLocations.includes(id) ? true : false;
  };

  const getIsCheckedCountry = (rootId, id) => {
    if (
      selectedLocations?.includes(id) ||
      selectedLocations?.includes(rootId)
    ) {
      return true;
    }
    return false;
  };

  const getIsCheckedState = (rootId, stateId, cId) => {
    if (
      selectedLocations?.includes(stateId) ||
      selectedLocations?.includes(cId) ||
      selectedLocations?.includes(rootId)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const getIsCheckedCity = (rootId, countryId, stateId, cityId) => {
    if (
      selectedLocations?.includes(stateId) ||
      selectedLocations?.includes(countryId) ||
      selectedLocations?.includes(cityId) ||
      selectedLocations?.includes(rootId)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const addRoot = (id,data) => {
    let isCheckedRoot = getIsCheckedRoot(id);
    if (isCheckedRoot) {
      setSelectedLocations([]);
    } else {
      setLocationSelected([data])
      setSelectedLocations([id]);
    }
  };

  const addCountry = (rootID, countryId,data) => {
    let isCountryChecked = getIsCheckedCountry(rootID, countryId);
    let isCheckedRoot = getIsCheckedRoot(rootID);
    if(!isCheckedRoot){
      if (!isCountryChecked) {
        setSelectedLocations([...selectedLocations,countryId]);
        setLocationSelected([...locationSelected,data])

      }else{
        let remainingArr = selectedLocations?.filter((item) => item != countryId);
        setSelectedLocations([...remainingArr]); 
        let nameArr=locationSelected?.filter((item)=>item.locationId!=countryId);
        setLocationSelected([...nameArr]);
      }
    }
  };

  const addState = (rootId, stateId, countryId, stateItems) => {
    console.log("state===>103",stateItems);
    let isCountryChecked = getIsCheckedCountry(rootId, countryId);
    let isCheckedState = getIsCheckedState(rootId, stateId, countryId);
    if (!isCountryChecked) {
      // if(!isCheckedState){
      //   setSelectedLocations([stateId]);
      //   // setLocationSelected([...data])

      // }else{
      //   setSelectedLocations([]);
      // }

      if (selectedLocations.includes(stateId)) {
        let remainselectedLocations = [...selectedLocations];
        // stateItems?.childNode.map((mItem) => {
        //   if (remainselectedLocations.includes(mItem.locationId)) {
        //     remainselectedLocations = remainselectedLocations?.filter((i) => i != mItem.locationId);
        //   }
        // });
        let remainingArr = remainselectedLocations?.filter((item) => item != stateId);
        setSelectedLocations([...remainingArr]); 
        let nameArr=locationSelected?.filter((item)=>item.locationId!=stateId);
        setLocationSelected([...nameArr]);
      } else {
        let remainselectedLocations = [...selectedLocations];
        // stateItems.childNode.map((mItem) => {
        //   if (remainselectedLocations.includes(mItem.locationId)) {
        //     remainselectedLocations = remainselectedLocations?.filter((i) => i != mItem.locationId);
        //   }
        // });
        setSelectedLocations([...selectedLocations, stateId]);
        setLocationSelected([...locationSelected,stateItems])
      }
    }
  };

  // const addCity = (rootId,countryId, stateId, cityId,data) => {
  //   let isStateChecked = getIsCheckedState(stateId);
  //   let isCityChecked = getIsCheckedCity(rootId, countryId, stateId, cityId);
  //   if (!isStateChecked) {
  //     // if(!isCityChecked){
  //     //   setLocationSelected(data)

  //     //   setSelectedLocations([cityId]);
  //     // }else{
  //     //   setSelectedLocations([]);
  //     // }
  //     if (!isStateChecked) {
  //       if (selectedLocations.includes(cityId)) {
  //         let remainingArr = selectedLocations?.filter((item) => item != cityId);
  //         let nameArr=locationSelected?.filter((item)=>item.locationId!=cityId)
  //         console.log("--->",cityId)
  //         setSelectedLocations([...remainingArr]);
  //         setLocationSelected([...nameArr]);
  //       } else {
  //         setSelectedLocations([...selectedLocations, cityId]);
  //         setLocationSelected([...locationSelected,data]);
  //       }
  //     }
  //   }
  // };

  const expandRoot=(id)=>{
    if (viewing?.rootId === id) {
      setViewing({
        country: null,
        state: null,
        rootId:null
      });
    } else {
      setViewing({
        country: null,
        state: null,
        rootId:id
      });
    }
  }
  const expandCountry = (name) => {
    if (viewing?.country === name) {
      setViewing({
        ...viewing,
        country: null,
        state: null,
      });
    } else {
      setViewing({
        ...viewing,
        country: name,
        state: null,
      });
    }
  };
  const expandState = (name) => {
    if (viewing?.state === name) {
      setViewing({
        ...viewing,
        state: null,
      });
    } else {
      setViewing({
        ...viewing,
        state: name,
      });
    }
  };

  const addCity = (rootId,countryId, stateId, cityId,data) => {
    let isStateChecked = getIsCheckedState(stateId);
    let isCityChecked = getIsCheckedCity(rootId, countryId, stateId, cityId);
    if (!isStateChecked) {
      // if(!isCityChecked){
      //   setLocationSelected(data)

      //   setSelectedLocations([cityId]);
      // }else{
      //   setSelectedLocations([]);
      // }
      if (!isStateChecked) {
        if (selectedLocations.includes(cityId)) {
          let remainingArr = selectedLocations?.filter((item) => item != cityId);
          let nameArr=locationSelected?.filter((item)=>item.locationId!=cityId)
          console.log("--->",cityId)
          setSelectedLocations([...remainingArr]);
          setLocationSelected([...nameArr]);
        } else {
          setSelectedLocations([...selectedLocations, cityId]);
          setLocationSelected([...locationSelected,data]);
        }
      }
    }
  };

  const addChild = (rootId, countryId, stateId, cityId,childId, data) => {
    
    let isStateChecked = getIsCheckedState(stateId);
    let isCityChecked = getIsCheckedCity(rootId, countryId, stateId, cityId);
    if (!isStateChecked) {
      if (!isCityChecked) {
        console.log(childId,"12345-208---->",);
        if(selectedLocations.includes(childId)){
          let remainingArr = selectedLocations?.filter((item) => item != childId);
          let nameArr=locationSelected?.filter((item)=>item.locationId!=childId);
          setSelectedLocations([...remainingArr]);
          setLocationSelected([...nameArr]);
        }else{
          setSelectedLocations([...selectedLocations, childId]);
          setLocationSelected([...locationSelected,data]);
        }
        
      } else {
        console.log(childId,"12345-217---->",selectedLocations)
        setSelectedLocations([]);
      }
    }
  };

  const getIsCheckedChild = (rootId, countryId, stateId, cityId,childId) => {
    if (
      selectedLocations?.includes(stateId) ||
      selectedLocations?.includes(countryId) ||
      selectedLocations?.includes(cityId) ||
      selectedLocations?.includes(rootId)||
      selectedLocations?.includes(childId)
    ) {
      
      return true;
    } else {
      
      return false;
    }
  };

  const expandCity = (name) => {
    
    if (viewing?.city === name) {
      setViewing({
        ...viewing,
        city:null,
      });
    } else {
      setViewing({
        ...viewing,
        city:name,
      });
    }
  };

  const expandChild = (name,value) => {
    
    if (viewing?.cityChild === value) {
      setViewing({
        ...viewing,
        cityChild: null,
      });
    } else {
      setViewing({
        ...viewing,
        cityChild: value,
      });
    }
  };

  const renderChild=(item,data,country,state,city,parent)=>{
    

    return(item.length>0&&
      item.map((ele, cityIndex) => {
        console.log(parent,"296===>",ele.locationName,ele.locationId)
        return (<>{
          <React.Fragment
            key={
              ele?.locationName +
              "city" +
              cityIndex
            }
          >
            <View style={Styles.separatorLine} />
            <LocationChildContainer
              isChecked={getIsCheckedChild(
                data?.locationId,
                country?.locationId,
                state?.locationId,
                city?.locationId,
                ele?.locationId
              )}
              locId={ele?.locationId}
              title={ele?.locationName}
              count={{
                high: ele?.activeDeviceCount,
                low: ele?.inactiveDeviceCount,
              }}
              isChevron={ele?.childNode}
              isChevronUp={viewing.cityChild==ele.locationName}
              onPressArrow={()=>expandChild("cityChild",ele.locationName)}
              onClickChecked={() =>
                addChild(
                  data?.locationId,
                  country?.locationId,
                  state?.locationId,
                  city?.locationId,
                  ele?.locationId,
                  ele
                )
              }
            />
            {ele?.childNode&&renderChild(ele.childNode,
              data,
              country,
              state,
              city,
              parent={parent})}
          </React.Fragment>
      }</>);
      })    )

    // return (
    //   <>
    //   <Text style={{color:"red"}}>No more Data</Text>
    //   </>
    // )
  }

  return (
    <View style={Styles.mainContainer}>
      <ScrollView nestedScrollEnabled style={Styles.scrollViewStyle}>
        <LocationBrandContainer
          title={data?.locationName}
          locId={data?.locationId}
          count={{
            high: data?.activeDeviceCount,
            low: data?.inactiveDeviceCount,
          }}
          isCheckedIconShow={true}
          isChecked={getIsCheckedRoot(data.locationId)}
          onClickChecked={() => {
            addRoot(data.locationId,data);
          }}

         onPressArrow={() => {
            expandRoot(data.locationId)
          }}
          isChevronUp={viewing.rootId === data.locationId}

        />
        {data &&
          viewing.rootId === data?.locationId && data.childNode.map((country, countryIndex) => {
            return (
              <React.Fragment
                key={country?.locationName + "country" + countryIndex}
              >
                <LocationCountryContainer
                  title={country?.locationName}
                  locId={country?.locationId}
                  count={{
                    high: country?.activeDeviceCount,
                    low: country?.inactiveDeviceCount,
                  }}
                  isCheckedIconShow={true}
                  isChecked={getIsCheckedCountry(
                    data?.locationId,
                    country?.locationId
                  )}
                  onPressArrow={() => expandCountry(country?.locationName)}
                  onClickChecked={() =>
                    addCountry(data?.locationId, country?.locationId,country)
                  }
                  isChevronUp={viewing?.country === country?.locationName}
                />
                {viewing.country === country.locationName &&
                  country?.childNode?.map((state, stateIndex) => {
                    // console.log("state===>411",state);
                    return (
                      <React.Fragment
                        key={state?.locationName + "state" + stateIndex}
                      >
                        <View style={Styles.separatorLine} />
                        <LocationStateContainer
                          locId={state?.locationId}
                          isChecked={getIsCheckedState(
                            data?.locationId,
                            state?.locationId,
                            country.locationId
                          )}
                          isCheckedIconShow={true}
                          onPressArrow={() => expandState(state?.locationName)}
                          title={state?.locationName}
                          count={{
                            high: state?.activeDeviceCount,
                            low: state?.inactiveDeviceCount,
                          }}
                          onClickChecked={() =>
                            addState(
                              data?.locationId,
                              state?.locationId,
                              country?.locationId,
                              state
                            )
                          }
                          isChevronUp={viewing?.state === state?.locationName}
                        />
                        {viewing.state === state?.locationName &&
                          state?.childNode?.map((city, cityIndex) => {
                            return (
                              <React.Fragment
                                key={city?.locationName + "city" + cityIndex}
                              >
                                <View style={Styles.separatorLine} />
                                <LocationCityContainer
                                  isChecked={getIsCheckedCity(
                                    data?.locationId,
                                    country?.locationId,
                                    state?.locationId,
                                    city?.locationId
                                  )}
                                  locId={ city?.locationId}
                                  isCheckedIconShow={true}
                                  title={city?.locationName}
                                  isChevron={city?.childNode}
                                  isChevronUp={viewing?.city === city?.locationName}
                                  onPressArrow={()=>expandCity(city?.locationName)}
                                  count={{
                                    high: city?.activeDeviceCount,
                                    low: city?.inactiveDeviceCount,
                                  }}
                                  onClickChecked={() =>
                                    addCity(
                                      data?.locationId,
                                      country?.locationId,
                                      state?.locationId,
                                      city?.locationId,
                                      city
                                    )
                                  }
                                />
                                {(city?.childNode&&viewing.city === city?.locationName) &&renderChild(city.childNode,
                                  data={locationId:data?.locationId},
                                  country={locationId:country?.locationId},
                                  state={locationId:state?.locationId},
                                  city={locationId:city?.locationId},
                                  parent={locationId:city?.locationId})
                                }
                              </React.Fragment>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
              </React.Fragment>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default LocationsForCampaign;
const LocationStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
      borderColor: COLORS.border,
      width:"100%"
    },
    scrollViewStyle: { maxHeight: moderateScale(250) },
    brandContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(10),
      width:"100%"
    },
    iconAndNameView: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    brandTextView: {
      flexDirection: "row",
      marginHorizontal: moderateScale(15),
    },
    brandText: {
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: COLORS.textColor,
    },
    textWrap: {
      flexDirection: "row",
      alignItems: "center",
      padding: moderateScale(1),
    },
    greenText: {
      color: COLORS.activeGreen,
      fontSize: moderateScale(18),
      fontWeight: "600",
    },
    redText: {
      color: COLORS.activeRed,
      fontSize: moderateScale(18),
      fontWeight: "600",
    },
    separatorLine: {
      height: moderateScale(1),
      width: "100%",
      backgroundColor: COLORS.border,
    },
  });
