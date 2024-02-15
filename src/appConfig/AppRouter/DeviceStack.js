import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {NAVIGATION_CONSTANTS} from '../../Constants/navigationConstant';
import AddMediaPlayerGroup from '../../screens/AddMediaPlayerGroup';
import Device from '../../screens/Device';
import DeviceConsolidated from '../../screens/DeviceConsolidated';
import MediaPlayerGroup from '../../screens/MediaPlayerGroups';
import RegisterDevice from '../../screens/RegisterDevice';
import EditMediaPlayerGroup from '../../screens/AddMediaPlayerGroup/EditMediaPlayerGroup';
import EditRegisterDevice from '../../screens/RegisterDevice/EditRegisterDevice';
import DraggableCompents from '../../screens/MediaPlayerGroups/DraggableCompents';
import EditUnRegisterDevice from '../../screens/RegisterDevice/EditUnRegisterDevice';
import ReplaceDevice from '../../screens/RegisterDevice/ReplaceDevice';


const DeviceStack = props => {
  const initialScreen = props?.route?.params?.screen;
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={
        initialScreen ? initialScreen : NAVIGATION_CONSTANTS.DEVICE
      }
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.VIEW_ALL_DEVICES}
        component={Device}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.REGISTER_NEW_DEVICE}
        component={RegisterDevice}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.MEDIA_PLAYER_GROUPS}
        component={MediaPlayerGroup}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.EDIT_MEDIA_PLAYER_GROUP}
        component={EditMediaPlayerGroup}
      />
      <Stack.Screen
          name={NAVIGATION_CONSTANTS.EDIT_REGISTER_DEVICE}
          component={EditRegisterDevice}
      />
      
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.REPLACE_DEVICE}
        component={ReplaceDevice}
      /> 
      <Stack.Screen
          name={"DraggableCompents"}
          component={DraggableCompents}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.EDIT_UN_REGISTER_DEVICE}
          component={EditUnRegisterDevice}
        />
      {/* <Stack.Screen
        name={NAVIGATION_CONSTANTS.DEVICE_SETTINGS}
        component={DeviceSettings}
      /> */}
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.DEVICE_CONSOLIDATE}
        component={DeviceConsolidated}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_MEDIA_PLAYER_GROUP}
        component={AddMediaPlayerGroup}
      />
    </Stack.Navigator>
  );
};

export default DeviceStack;
