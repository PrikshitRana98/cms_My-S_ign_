import AsyncStorage from '@react-native-async-storage/async-storage';

export const getStorageForKey = async (key = '') => {
  return await AsyncStorage.getItem(key);
};
export const setStorageForKey = async (key = '', data) => {
  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }
  await AsyncStorage.setItem(key, data);
};
export const removeKeyInStorage = async key => {
  await AsyncStorage.removeItem(key);
};
