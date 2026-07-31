/**
 * Multi-Tab Authentication Synchronizer
 * Uses BroadcastChannel API with fallback to localStorage 'storage' event listener
 * Synchronizes login, logout, and token refresh events seamlessly across tabs
 */

const CHANNEL_NAME = 'fitaix_auth_channel';
const STORAGE_KEY = 'fitaix_auth_event';

let channel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    channel = null;
  }
}

/**
 * Broadcasts an authentication event to all other open tabs
 */
export function broadcastAuthEvent(type, payload = {}) {
  const eventData = { type, payload, timestamp: Date.now() };

  if (channel) {
    channel.postMessage(eventData);
  }

  // Fallback / secondary signal via storage event
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventData));
  } catch (e) {}
}

/**
 * Subscribes to authentication events broadcast by other tabs
 */
export function subscribeAuthEvents(onEvent) {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (event) => {
    if (event.data && event.data.type) {
      onEvent(event.data.type, event.data.payload);
    }
  };

  if (channel) {
    channel.addEventListener('message', handleMessage);
  }

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed && parsed.type) {
          onEvent(parsed.type, parsed.payload);
        }
      } catch (e) {}
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}
