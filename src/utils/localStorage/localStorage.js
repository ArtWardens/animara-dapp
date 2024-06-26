import { StorageUtility } from './storageUtility';

export const initData = new StorageUtility('init');

export const updateDataInStorage = (storageUtility, keysToUpdate, newValues) => {
  const currentData = storageUtility.getItem();
  const updatedData = { ...currentData, ...newValues };

  for (const key of keysToUpdate) {
    if (Reflect.has(newValues, key)) {
      updatedData[key] = newValues[key];
    }
  }

  storageUtility.setItem(updatedData);
  return updatedData;
};

export const clearAllStorageData = () => localStorage.clear();
