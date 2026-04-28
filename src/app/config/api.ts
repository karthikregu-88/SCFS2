import { Capacitor } from '@capacitor/core';

// Try to get a user-configured IP address from localStorage (for physical device testing)
let customIp = localStorage.getItem('SERVER_IP');
if (customIp && !customIp.startsWith('http')) {
  customIp = 'http://' + customIp;
}

// Use custom IP, or fallback to 10.0.2.2 (Android Emulator proxy), or localhost (Web)
export const API_BASE_URL = customIp 
  ? customIp 
  : Capacitor.isNativePlatform()
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';
