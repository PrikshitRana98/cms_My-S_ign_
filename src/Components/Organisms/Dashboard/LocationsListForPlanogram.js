import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { moderateScale } from "../../../Helper/scaling";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import {
  LocationBrandContainer,
  LocationCityContainer,
  LocationCountryContainer,
  LocationStateContainer,
} from "../../Molecules/LocationBrandView1";
import { getStorageForKey } from "../../../Services/Storage/asyncStorage";
import { PlanogramManagerService, getDeviceGroupByLocation } from "../../../screens/Planogram/PlonogramApi";
import { useSelector } from "react-redux";


const LocationsListForPlanogram = ({ data = null,selectedLocations,setSelectedLocations,setIsLoading = () => {}}) => {
  const userlocation= useSelector((state)=>state.userReducer.userRole.locations)
  const themeColor = useThemeContext();
  const Styles = LocationStyles(themeColor);
  const [viewing, setViewing] = useState({ country: null, state: null,rootId:0 });
  const getIsCheckedRoot=(id)=>{
   return  selectedLocations.includes(id) ? true : false;
  }

  const getIsCheckedCountry = (rootId,id) => {
    if(selectedLocations?.includes(id) || selectedLocations?.includes(rootId)){
      return true;
    }
    return false
  };

  const getIsCheckedState = (rootId,stateId, cId) => {
    if (selectedLocations?.includes(stateId) || selectedLocations?.includes(cId) || selectedLocations?.includes(rootId)) {
      return true;
    } else {
      return false;
    }
  };
 const getIsCheckedCity = (rootId,countryId, stateId, cityId) => {
    if (
      selectedLocations?.includes(stateId) ||
      selectedLocations?.includes(countryId) ||
      selectedLocations?.includes(cityId)||
      selectedLocations?.includes(rootId)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const addRoot=(id)=>{
    let isCheckedRoot = getIsCheckedRoot(id)
    if (isCheckedRoot) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations([...selectedLocations, id]);
    }
  }

  const addCountry = (rootID,countryId) => {
    let isCountryChecked = getIsCheckedCountry(rootID,countryId)
    let isCheckedRoot = getIsCheckedRoot(rootID)
    if (isCountryChecked) {
      isCheckedRoot ? setSelectedLocations([rootID]) : setSelectedLocations([])
    } else {
      !isCheckedRoot && setSelectedLocations([...selectedLocations, countryId]);
    }
  };

  const addState = (rootId,stateId, countryId, stateItems) => {
    let isCountryChecked = getIsCheckedCountry(rootId,countryId);
    if (!isCountryChecked) {
      if (selectedLocations.includes(stateId)) {
        let remainselectedLocations = [...selectedLocations];
        stateItems.childNode.map((mItem) => {
          if (remainselectedLocations.includes(mItem.locationId)) {
            remainselectedLocations = remainselectedLocations?.filter((i) => i != mItem.locationId);
          }
        });
        let remainingArr = remainselectedLocations?.filter((item) => item != stateId);
        setSelectedLocations([...remainingArr]); 
      } else {
        let remainselectedLocations = [...selectedLocations];
        stateItems.childNode.map((mItem) => {
          if (remainselectedLocations.includes(mItem.locationId)) {
            remainselectedLocations = remainselectedLocations?.filter((i) => i != mItem.locationId);
          }
        });
        setSelectedLocations([...remainselectedLocations, stateId]);
      }
    }
  };

  const addCity = (countryId, stateId, cityId) => {
    let isStateChecked = getIsCheckedState(stateId);
    if (!isStateChecked) {
      if (selectedLocations.includes(cityId)) {
        let remainingArr = selectedLocations?.filter((item) => item != cityId);
        setSelectedLocations([...remainingArr]);
      } else {
        setSelectedLocations([...selectedLocations, cityId]);
      }
    }
  };

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

  const renderChild=(city,cityIndex,data,country,state)=>{
    return(<>
      <React.Fragment
        key={city?.locationName + "city" + cityIndex}
      >
        <View style={Styles.separatorLine} />
        <LocationCityContainer
          locId={ city?.locationId}
          isChecked={getIsCheckedCity(
            data?.locationId,
            country?.locationId,
            state?.locationId,
            city?.locationId
          )}
          title={city?.locationName}
          count={{ high: null, low: null }}
          // isChevron={city?.childNode}
          onClickChecked={() =>
            addCity(
              country?.locationId,
              state?.locationId,
              city?.locationId
            )
          }
        />
        {city?.childNode&&city.childNode.map((child,childIndex)=>{
        return(<>{renderChild(child,childIndex,data,country,state)}</>)
        })}
      </React.Fragment>
    </>)
  }

  return (
    <View style={Styles.mainContainer}>
      <ScrollView nestedScrollEnabled style={Styles.scrollViewStyle}>
        <LocationBrandContainer
          title={data?.locationName}
          locId={data?.locationId}
          count={{ high: null, low: null }}
          onClickChecked={() => {addRoot(data.locationId)}}
          isChecked={getIsCheckedRoot(data.locationId)}
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
                  locId={country?.locationId}
                  title={country?.locationName}
                  count={{ high: null, low: null }}
                  isChecked={getIsCheckedCountry(data?.locationId,country?.locationId)}
                  onPressArrow={() => expandCountry(country?.locationName)}
                  onClickChecked={() => addCountry(data?.locationId,country?.locationId)}
                  isChevronUp={viewing?.country === country?.locationName}
                />
                {viewing.country === country.locationName &&
                  country?.childNode?.map((state, stateIndex) => {
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
                          onPressArrow={() => expandState(state?.locationName)}
                          title={state?.locationName}
                          count={{ high: null, low: null }}
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
                                  locId={ city?.locationId}
                                  isChecked={getIsCheckedCity(
                                    data?.locationId,
                                    country?.locationId,
                                    state?.locationId,
                                    city?.locationId
                                  )}
                                  title={city?.locationName}
                                  count={{ high: null, low: null }}
                                  // isChevron={city?.childNode}
                                  onClickChecked={() =>
                                    addCity(
                                      country?.locationId,
                                      state?.locationId,
                                      city?.locationId
                                    )
                                  }
                                />
                                {city?.childNode&&city.childNode.map((child,childIndex)=>{
                                  return(<>{renderChild(child,childIndex,data,country,state)}</>)
                                })}
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

export default LocationsListForPlanogram;
const LocationStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
      borderColor: COLORS.border,
    },
    scrollViewStyle: { maxHeight: moderateScale(250) },
    brandContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(10),
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
