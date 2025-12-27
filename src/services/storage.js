// Storage service - uses localStorage (no external database needed)
// Data persists in browser, works offline, zero setup

const STORAGE_KEY = 'transformationChallengeState_v3_react';

class StorageService {
  async saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { success: true };
    } catch (error) {
      console.error('Save error:', error);
      return { success: false, error };
    }
  }

  async loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Load error:', error);
      return null;
    }
  }

  async saveMonthHistory(monthData) {
    try {
      const history = JSON.parse(localStorage.getItem('monthHistory') || '[]');
      history.push(monthData);
      localStorage.setItem('monthHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Save month history error:', error);
    }
  }

  async getMonthHistory() {
    try {
      return JSON.parse(localStorage.getItem('monthHistory') || '[]');
    } catch (error) {
      console.error('Get month history error:', error);
      return [];
    }
  }
}

export const storageService = new StorageService();
