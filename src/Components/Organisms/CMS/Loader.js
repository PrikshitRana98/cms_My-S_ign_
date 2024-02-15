import {ActivityIndicator, Modal, StyleSheet, Text, View,Dimensions} from 'react-native';

const Loader = ({visible = false}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <ActivityIndicator
            style={{alignSelf: 'center'}}
            size={'large'}
            color={'#253D91'}
          />
          <Text style={{color: 'white',fontSize:18,marginTop:10}}>Please wait...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    // backgroundColor: '#10281C',
    // borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    // elevation: 5,
    width: Dimensions.get('screen').width * 0.5,
    alignSelf: 'center',
  },
});
