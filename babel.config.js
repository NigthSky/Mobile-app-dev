module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  //   "plugins": [
  //   "@babel/plugin-proposal-class-properties"
  // ]
    // plugins: [
    //   'react-native-reanimated/plugin',
    // ],
  };
};
