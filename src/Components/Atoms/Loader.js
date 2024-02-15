import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Modal, Portal} from 'react-native-paper';

const AppLoader = () => (
  <Portal>
    <Modal visible style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" />
    </Modal>
  </Portal>
);

export default AppLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
