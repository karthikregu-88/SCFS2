import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.campuseats.app',
  appName: 'campus_eats_app',
  webDir: 'dist',
  android: {
    path: 'campus_eats_app'
  },
  server: {
    cleartext: true,
    androidScheme: 'http'
  }
};

export default config;
