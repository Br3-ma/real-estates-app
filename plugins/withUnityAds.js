// import { withBuildProperties } from 'expo-build-properties';

// const withUnityAds = (config) => {
//   // Adds extra Pod for iOS, as specified in:
//   // https://developers.google.com/admob/ios/mediation/unity#step_3_import_the_unity_ads_sdk_and_adapter
//   config = withBuildProperties(config, {
//     ios: {
//       extraPods: [
//         { name: "GoogleMobileAdsMediationUnity" },
//       ],
//     },
//   });

//   // Adds extra Gradle dependencies for Android, as specified in:
//   // https://developers.google.com/admob/android/mediation/unity#android_studio_integration_recommended
//   config = withBuildProperties(config, {
//     android: {
//       extraDependencies: [
//         "implementation 'com.unity3d.ads:unity-ads:4.12.4'",
//         "implementation 'com.google.ads.mediation:unity:4.12.5.0'",
//       ],
//     },
//   });

//   return config;
// };

// export default withUnityAds;
