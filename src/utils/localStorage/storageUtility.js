export class StorageUtility {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  setItem(data) {
    try {
      localStorage.setItem(this.storageKey, typeof data === 'string' ? data : JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data:', e);
    }
  }

  getItem() {
    try {
      const combinedData = localStorage.getItem(this.storageKey);
      if (!combinedData) return undefined;

      try {
        return JSON.parse(combinedData);
      } catch (error) {
        return combinedData;
      }
    } catch (error) {
      console.log('An error occurred during data retrieval, clearing storage...', error);
      localStorage.clear();
      return undefined;
    }
  }

  clearItem() {
    localStorage.removeItem(this.storageKey);
  }
}
