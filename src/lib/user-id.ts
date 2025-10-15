const USER_ID_KEY = 'crypto-explorer-user-id';

export function getOrCreateAnonUserId(): string {
  if (typeof window === 'undefined') {
    // Server-side: return a temporary ID that will be replaced on client
    return 'temp-' + Math.random().toString(36).substr(2, 9);
  }

  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // Generate a UUID-like ID
    userId = 'user-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
    localStorage.setItem(USER_ID_KEY, userId);
    console.log('Generated new userId:', userId);
  } else {
    console.log('Using existing userId:', userId);
  }
  
  return userId;
}

export function clearUserId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_ID_KEY);
  }
}
