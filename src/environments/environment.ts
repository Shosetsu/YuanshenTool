import { Constants } from 'src/app/constants/cosntants';

export const environment = {
  production: false,
  storageVerison: 0.2,
  storageKeys: [
    Constants.STORAGE_VERSION_KEY,
    Constants.SYSTEM_KEY,
    Constants.MENU_KEY,
    Constants.ROLL_TODAY_KEY,
  ],
};
