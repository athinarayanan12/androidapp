import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.autotube.app',
  appName: 'AutoTube',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
