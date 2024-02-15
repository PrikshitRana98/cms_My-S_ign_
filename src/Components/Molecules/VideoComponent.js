import {
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Video from "react-native-video";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";

export default function VideoComponent({ videoUrl, isMuted }) {
  const [videoInd, setvideoInd] = React.useState({ opacity: 0 });
  const videoPlayer = React.useRef();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted1, setIsMuted1] = React.useState(isMuted);

  const themeColor = useThemeContext();
  const onBuffer = ({ isBuffering }) => {
    setvideoInd({ opacity: isBuffering ? 1 : 0 });
  };

  const onEnd = () => {
    setIsPlaying(false);
  };

  const onLoad = () => {
    setvideoInd({ opacity: 0 });
  };
  onLoadStart = () => {
    setvideoInd({ opacity: 1 });
  };
  return (
    <>
      <Pressable
        onPress={() => {
          setIsPlaying(!isPlaying);
        }}
        style={[{ height: "100%", width: "100%", justifyContent: "center" }]}
      >
        <Video
          ref={(ref) => (videoPlayer.current = ref)}
          source={{ uri: videoUrl }}
          controls={false}
          resizeMode={"contain"}
          paused={isPlaying}
          style={styles.backgroundVideo}
          muted={isMuted}
          fullScreen={false}
          onBuffer={onBuffer}
          onLoad={onLoad}
          onEnd={onEnd}
          onLoadStart={onLoadStart}
        />
        <ActivityIndicator
          animating
          size="large"
          color={themeColor.themeColor}
          style={[
            { position: "absolute", alignSelf: "center" },
            { opacity: videoInd.opacity },
          ]}
        />
      </Pressable>
    </>
  );
}
var styles = StyleSheet.create({
  backgroundVideo: {
    // backgroundColor:'#000',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
  },
  pdf: {
    // flex:1,
    // paddingHorizontal:16,
    marginTop: 10,
    paddingVertical: 50,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 1.5,
  },
  imgStyle: {
    resizeMode: "contain",
  },
});
