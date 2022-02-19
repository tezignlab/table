import { Dimensions } from 'react-native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const videoWidth = width;
const videoHeight = (width * 9) / 16;

export default {
  window: {
    width,
    height,
  },
  video: {
    height: videoHeight,
    width: videoWidth,
  },
  isSmallDevice: width < 375,
};
