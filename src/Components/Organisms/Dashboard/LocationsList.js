import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {moderateScale} from '../../../Helper/scaling';
import {useThemeContext} from '../../../appConfig/AppContext/themeContext';
import {
  LocationBrandContainer,
  LocationCityContainer,
  LocationCountryContainer,
  LocationStateContainer,
} from '../../Molecules/LocationBrandView';

const data = [
  {
    name: 'Burger King',
    count: {high: 170, low: 89},
    countriesList: [
      {
        name: 'India',
        count: {high: 170, low: 89},
        statesList: [
          {
            name: 'Haryana',
            count: {high: 40, low: 20},
            citiesList: [
              {name: 'Gurugram', high: 21, low: 13},
              {name: 'Faridabad', high: 19, low: 7},
            ],
          },
          {
            name: 'Gujarat',
            count: {high: 41, low: 19},
            citiesList: [
              {name: 'Ahmadabad', high: 28, low: 2},
              {name: 'Surat', high: 12, low: 0},
            ],
          },
          {
            name: 'Tamil Nadu',
            count: {high: 43, low: 23},
            citiesList: [{name: 'Chennai', high: 43, low: 23}],
          },
          {
            name: 'Uttar Pradesh',
            count: {high: 46, low: 27},
            citiesList: [
              {name: 'Lucknow', high: 18, low: 17},
              {name: 'Kanpur', high: 28, low: 10},
            ],
          },
        ],
      },
      {
        name: 'USA',
      },
    ],
  },
];
const LocationsList = () => {
  const themeColor = useThemeContext();
  const Styles = LocationStyles(themeColor);
  const [selected, setSelected] = useState([{countriesList: []}]);
  const [viewing, setViewing] = useState({
    country: null,
    state: null,
  });

  const getIsCheckedCountry = name => {
    return selected?.some(item =>
      item.countriesList?.some(country => country?.name === name),
    );
  };

  const getIsCheckedState = name => {
    return selected?.some(item => {
      return item.countriesList?.some(country => {
        return (
          country?.statesList &&
          country?.statesList?.some(state => state?.name === name)
        );
      });
    });
  };
  const getIsCheckedCity = name => {
    return selected?.some(item => {
      return item.countriesList?.some(country => {
        return (
          country?.statesList &&
          country?.statesList?.some(state => {
            return (
              state?.citiesList &&
              state?.citiesList?.some(city => city?.name === name)
            );
          })
        );
      });
    });
  };

  const addCountry = countryName => {
    setSelected(prevSelected => {
      const isCountryPresent = prevSelected[0].countriesList?.some(
        country => country?.name === countryName,
      );

      if (isCountryPresent) {
        const updatedCountries = prevSelected[0].countriesList?.filter(
          country => country?.name !== countryName,
        );
        return [{...prevSelected[0], countriesList: updatedCountries}];
      } else {
        const newCountry = {name: countryName};
        const updatedCountries = [...prevSelected[0].countriesList, newCountry];
        return [{...prevSelected[0], countriesList: updatedCountries}];
      }
    });
  };

  const addState = (countryName, stateName) => {
    setSelected(prevSelected => {
      const updatedCountries = prevSelected[0].countriesList?.map(country => {
        if (country?.name === countryName) {
          const isStatePresent = country?.statesList?.some(
            state => state?.name === stateName,
          );

          if (isStatePresent) {
            const updatedStates = country?.statesList?.filter(
              state => state?.name !== stateName,
            );
            return {...country, statesList: updatedStates};
          } else {
            const newState = {name: stateName};
            const updatedStates = [...country?.statesList, newState];
            return {...country, statesList: updatedStates};
          }
        }
        return country;
      });

      const isCountryPresent = updatedCountries?.some(
        country => country?.name === countryName,
      );

      if (!isCountryPresent) {
        const newCountry = {
          name: countryName,
          statesList: [{name: stateName}],
        };
        updatedCountries.push(newCountry);
      }

      return [{...prevSelected[0], countriesList: updatedCountries}];
    });
  };

  const addCity = (countryName, stateName, cityName) => {
    setSelected(prevSelected => {
      const updatedCountries = prevSelected[0].countriesList?.map(country => {
        if (country?.name === countryName) {
          const updatedStates = country?.statesList?.map(state => {
            if (state?.name === stateName) {
              const isCityPresent = state?.citiesList?.some(
                city => city?.name === cityName,
              );

              if (isCityPresent) {
                const updatedCities = state?.citiesList?.filter(
                  city => city?.name !== cityName,
                );
                return {...state, citiesList: updatedCities};
              } else {
                const newCity = {name: cityName};
                const updatedCities = [...state?.citiesList, newCity];
                return {...state, citiesList: updatedCities};
              }
            }
            return state;
          });

          const isStatePresent = updatedStates?.some(
            state => state?.name === stateName,
          );

          if (!isStatePresent) {
            const newState = {
              name: stateName,
              citiesList: [{name: cityName}],
            };
            updatedStates.push(newState);
          }

          return {...country, statesList: updatedStates};
        }
        return country;
      });

      const isCountryPresent = updatedCountries?.some(
        country => country?.name === countryName,
      );

      if (!isCountryPresent) {
        const newCountry = {
          name: countryName,
          statesList: [{name: stateName, citiesList: [{name: cityName}]}],
        };
        updatedCountries.push(newCountry);
      }

      return [{...prevSelected[0], countriesList: updatedCountries}];
    });
  };

  const expandCountry = name => {
    if (viewing?.country === name) {
      setViewing({});
    } else {
      setViewing({
        country: name,
        state: null,
      });
    }
  };

  const expandState = name => {
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

  return (
    <View style={Styles.mainContainer}>
      <ScrollView nestedScrollEnabled style={Styles.scrollViewStyle}>
        {data.map((brand, index) => {
          return (
            <React.Fragment key={brand.name}>
              <LocationBrandContainer title={brand?.name}  count={brand.count} />
              {brand?.countriesList?.map((country, countryIndex) => {
                return (
                  <React.Fragment key={country?.name}>
                    <View style={Styles.separatorLine} />
                    <LocationCountryContainer
                      title={country?.name}
                      count={country?.count}
                      isChecked={getIsCheckedCountry(country?.name)}
                      onPressArrow={() => expandCountry(country?.name)}
                      onClickChecked={() => addCountry(country?.name)}
                      isChevronUp={viewing?.country === country?.name}
                    />
                    {viewing.country === country.name &&
                      country?.statesList?.map((state, stateIndex) => {
                        return (
                          <React.Fragment key={state?.name}>
                            <View style={Styles.separatorLine} />
                            <LocationStateContainer
                              isChecked={getIsCheckedState(state?.name)}
                              onPressArrow={() => expandState(state?.name)}
                              title={state?.name}
                              count={state?.count}
                              onClickChecked={() =>
                                addState(country?.name, state?.name)
                              }
                              isChevronUp={viewing?.state === state?.name}
                            />
                            {viewing.state === state?.name &&
                              state?.citiesList?.map((city, cityIndex) => {
                                return (
                                  <React.Fragment key={city?.name}>
                                    <View style={Styles.separatorLine} />
                                    <LocationCityContainer
                                      isChecked={getIsCheckedCity(city?.name)}
                                      title={city?.name}
                                      count={city?.count}
                                      onClickChecked={() =>
                                        addCity(
                                          country?.name,
                                          state?.name,
                                          city?.name,
                                        )
                                      }
                                    />
                                  </React.Fragment>
                                );
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

export default LocationsList;
const LocationStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
      borderColor: COLORS.border,
    },
    scrollViewStyle: {maxHeight: moderateScale(250)},
    brandContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(10),
    },
    iconAndNameView: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    brandTextView: {
      flexDirection: 'row',
      marginHorizontal: moderateScale(15),
    },
    brandText: {
      fontSize: moderateScale(18),
      fontWeight: '600',
      color: COLORS.textColor,
    },
    textWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: moderateScale(1),
    },
    greenText: {
      color: COLORS.activeGreen,
      fontSize: moderateScale(18),
      fontWeight: '600',
    },
    redText: {
      color: COLORS.activeRed,
      fontSize: moderateScale(18),
      fontWeight: '600',
    },
    separatorLine: {
      height: moderateScale(1),
      width: '100%',
      backgroundColor: COLORS.border,
    },
  });
