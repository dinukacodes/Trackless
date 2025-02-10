// background.js

// Tracker domains list (simplified for demonstration, consider using a more comprehensive list)
const trackerDomains = [
    "doubleclick.net",
    "google-analytics.com",
    "googletagmanager.com",
    "facebook.com/tr",
    "cdn.mxpnl.com",
    "quantserve.com",
    "scorecardresearch.com"
    // Add more tracker domains as needed
  ];
  
  let trackerBlockingEnabled = false; // Initially disabled
  let secureBrowsingEnabled = false; // Initially disabled
  let blockedTrackerCount = 0;
  let sessionBlockedTrackerCount = 0; // Trackers blocked in the current session
  
  // Load settings and counts from storage on extension startup
  chrome.storage.local.get(['trackerBlockingEnabled', 'secureBrowsingEnabled', 'blockedTrackerCount', 'sessionBlockedTrackerCount'], function(data) {
    trackerBlockingEnabled = data.trackerBlockingEnabled !== undefined ? data.trackerBlockingEnabled : false;
    secureBrowsingEnabled = data.secureBrowsingEnabled !== undefined ? data.secureBrowsingEnabled : false;
    blockedTrackerCount = data.blockedTrackerCount !== undefined ? data.blockedTrackerCount : 0;
    sessionBlockedTrackerCount = data.sessionBlockedTrackerCount !== undefined ? data.sessionBlockedTrackerCount : 0;
  
    updateWebRequestListeners();
  });
  
  function updateWebRequestListeners() {
    // Clear existing listeners to avoid duplicates when toggling features
    chrome.webRequest.onBeforeRequest.removeListener(trackerBlocker);
    chrome.webRequest.onBeforeRequest.removeListener(httpsEnforcer);
  
    if (trackerBlockingEnabled) {
      chrome.webRequest.onBeforeRequest.addListener(
        trackerBlocker,
        { urls: ["<all_urls>"] },
        ["blocking"]
      );
    }
    if (secureBrowsingEnabled) {
      chrome.webRequest.onBeforeRequest.addListener(
        httpsEnforcer,
        { urls: ["<all_urls>"] },
        ["blocking"]
      );
    }
  }
  
  
  function trackerBlocker(details) {
    const url = new URL(details.url);
    if (trackerDomains.some(domain => url.hostname.includes(domain))) {
      blockedTrackerCount++;
      sessionBlockedTrackerCount++;
      chrome.storage.local.set({
        'blockedTrackerCount': blockedTrackerCount,
        'sessionBlockedTrackerCount': sessionBlockedTrackerCount
      });
      updatePopupCounts(); // Update popup in real-time
      return { cancel: true };
    }
  }
  
  function httpsEnforcer(details) {
    const url = new URL(details.url);
    if (url.protocol === 'http:') {
      return { redirectUrl: details.url.replace("http://", "https://") };
    }
  }
  
  function clearCookies() {
    return new Promise((resolve) => {
        chrome.cookies.getAll({}, function(cookies) {
            let cookiesClearedCount = 0;
            const totalCookies = cookies.length;
            
            // If no cookies to clear
            if (totalCookies === 0) {
                resolve({ clearedCookies: 0 });
                return;
            }

            cookies.forEach((cookie, index) => {
                const protocol = cookie.secure ? "https://" : "http://";
                const url = protocol + cookie.domain + cookie.path;
                
                chrome.cookies.remove({
                    url: url,
                    name: cookie.name
                }, () => {
                    cookiesClearedCount++;
                    
                    // When all cookies have been processed
                    if (cookiesClearedCount === totalCookies) {
                        resolve({ clearedCookies: cookiesClearedCount });
                    }
                });
            });
        });
    });
}
  
  function getCookieUrl(cookie) {
    const protocol = cookie.secure ? "https://" : "http://";
    return protocol + cookie.domain + cookie.path;
  }
  
  function togglePrivacyFeatures(enabled) {
    trackerBlockingEnabled = enabled;
    secureBrowsingEnabled = enabled; // Enable both for "all privacy features" button
    chrome.storage.local.set({
      'trackerBlockingEnabled': trackerBlockingEnabled,
      'secureBrowsingEnabled': secureBrowsingEnabled
    });
    updateWebRequestListeners(); // Re-apply listeners based on new settings
    updatePopupToggleState(enabled); // Update toggle button in popup
  }
  
  // Function to reset session tracker count when popup is opened (optional behavior - can be removed if persistent session count is desired)
  function resetSessionTrackerCount() {
      sessionBlockedTrackerCount = 0;
      chrome.storage.local.set({ 'sessionBlockedTrackerCount': sessionBlockedTrackerCount });
      updatePopupCounts();
  }
  
  
  // Communication with Popup to update UI
  function updatePopupCounts() {
    chrome.runtime.sendMessage({
      action: "updateCounts",
      blockedTrackers: sessionBlockedTrackerCount,
      clearedCookies: -1 // Indicate cookie count is not being updated here, only trackers
    });
  }
  
  function updatePopupCookiesCleared(clearedCookiesCount) {
    chrome.runtime.sendMessage({
      action: "updateCounts",
      blockedTrackers: -1, // Indicate tracker count is not being updated here, only cookies
      clearedCookies: clearedCookiesCount
    });
  }
  
  function updatePopupToggleState(isEnabled) {
      chrome.runtime.sendMessage({
          action: "updateToggleState",
          privacyFeaturesEnabled: isEnabled
      });
  }
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "clearCookies") {
        clearCookies().then(response => {
            sendResponse(response);
        });
        return true; // Required for async response
    }
});
  
  // Listener for messages from popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "enablePrivacy") {
      togglePrivacyFeatures(true);
    } else if (request.action === "disablePrivacy") {
      togglePrivacyFeatures(false);
    } else if (request.action === "clearCookies") {
      clearCookies();
    } else if (request.action === "getCounts") {
      sendResponse({
        blockedTrackers: sessionBlockedTrackerCount,
        clearedCookies: -1 // Not tracking persistent cookie cleared count for now
      });
    } else if (request.action === "getToggleState") {
      sendResponse({ privacyFeaturesEnabled: trackerBlockingEnabled && secureBrowsingEnabled });
    } else if (request.action === "resetSessionCount") {
      resetSessionTrackerCount();
    }
  });