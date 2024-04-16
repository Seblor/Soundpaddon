const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
// const FFmpegStatic = require("ffmpeg-static-electron-forge").default
// const path = require('path');

// const iconPath = path.join(__dirname, './assets/soundpaddon')
const iconPath = './assets/soundpaddon.ico'

module.exports.packagerConfig = {
  asar: {
    unpack: 'ffmpeg.exe'
  },
  icon: iconPath,
};
module.exports.rebuildConfig = {};
module.exports.makers = [
  {
    name: '@electron-forge/maker-squirrel',
    config: {
      iconUrl: 'https://www.soundpaddon.app/soundpaddon.ico',
      setupIcon: iconPath,
      authors: 'Sébastien "Seblor" Lorentz',
      description: 'Soundpaddon, an addon for Soundpad'
    },
  },
  {
    name: '@electron-forge/maker-wix',
    config: {
      iconUrl: 'https://www.soundpaddon.app/soundpaddon.ico',
      icon: iconPath,
      manufacturer: 'Sébastien \'Seblor\' Lorentz',
      description: 'Soundpaddon, an addon for Soundpad',
      ui: {
        "enabled": true,
        "chooseDirectory": true
      }
    },
  },
  {
    name: '@electron-forge/maker-zip',
    platforms: ['darwin'],
  },
  {
    name: '@electron-forge/maker-deb',
    config: {},
  },
  {
    name: '@electron-forge/maker-rpm',
    config: {},
  },
];
module.exports.plugins = [
  {
    name: '@electron-forge/plugin-auto-unpack-natives',
    config: {},
  },
  // Fuses are used to enable/disable various Electron functionality
  // at package time, before code signing the application
  new FusesPlugin({
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableCookieEncryption]: true,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
  }),
  // new FFmpegStatic({
  //   remove: true, // Required
  //   path: path.join(__dirname, "src/"), // Set path of main build
  // }),
];
