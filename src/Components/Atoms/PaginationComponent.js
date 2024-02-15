import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    Dimensions,
  } from 'react-native';
  import React from 'react';
  
  export default function PaginationComponent(props) {
    // if (!props.totalPages || (props.totalPages && props.totalPages === 1)) {
    //   return <View />;
    // }
    const pageNumbers = [];
    for (let i = 1; i <= props.totalPages; i++) {
      pageNumbers.push(
        <Pressable
          key={i}
          onPress={() => {
            props.setPage(i);
          }}
          style={[
            props.buttonStyles ? props.buttonStyles : styles.buttonStyles,
            props.activePage === i
              ? props.active
                ? props.active
                : styles.active
              : props.inactive
              ? props.inactive
              : styles.inactive,
          ]}>
          <Text style={styles.paginationText}>{i}</Text>
        </Pressable>,
      );
    }
  
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          width: Dimensions.get('window').width,
          padding:20
        }}
        horizontal={true}>
        <View style={styles.paginationWrapper}>
          <Pressable
            style={[
              props.buttonStyles ? props.buttonStyles : styles.buttonStyles,
              props.pressAbleButtonStyles
                ? props.pressAbleButtonStyles
                : styles.pressAbleButtonStyles,
            ]}
            onPress={() => {
              if (props.activePage > 1) {
                props.setPage(props.activePage - 1);
              }
            }}>
            <Text style={{color:"#000"}}>L</Text>
          </Pressable>
          {pageNumbers}
          <Pressable
            style={[
              props.buttonStyles ? props.buttonStyles : styles.buttonStyles,
              styles.pressAbleButtonStyles,
            ]}
            onPress={() => {
              if (props.activePage !== props.totalPages) {
                props.setPage(props.activePage + 1);
              }
            }}>
             <Text style={{color:"#000"}}>R</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    paginationWrapper: {
      height: 45,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    buttonStyles: {
      height: 35,
      width: 35,
      borderRadius: 40,
      backgroundColor: 'rgba(0,0,0,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 4,
    },
  
    inactive: {
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    active: {
      backgroundColor: '#242424',
    },
    pressAbleButtonStyles: {
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    paginationText: {
      fontSize: 16,
      color: '#ffffff',
      fontWeight: '600',
    },
  });