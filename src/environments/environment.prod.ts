import { Constants } from 'src/app/constants/cosntants';

export const environment = {
  production: true,
  storageVerison: 0.2,
  storageKeys: [
    Constants.STORAGE_VERSION_KEY,
    Constants.MENU_KEY,
    Constants.ROLL_TODAY_KEY,
  ],
};
