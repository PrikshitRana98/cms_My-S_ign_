import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

const THUMB_RADIUS = 15;

const Thumb = () => <View style={styles.root} />;

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 1,
    height: THUMB_RADIUS * 1,
    borderRadius: THUMB_RADIUS,
    borderWidth: 1,
    borderColor: "#ffffff",
    backgroundColor: "#253D91",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.16,
    shadowRadius: 6
  }
});

export default memo(Thumb);
