// Updated popup.js with Whitelist Mode

document.addEventListener('DOMContentLoaded', function () {
    // UI Elements
    const elements = {
        privacyToggle: document.getElementById('privacyToggle'),
        privacyStatus: document.getElementById('privacyStatus'),
        clearCookiesBtn: document.getElementById('clearCookiesButton'),
        trackerCount: document.getElementById('blockedTrackersCount'),
        cookieCount: document.getElementById('clearedCookiesCount'),
        whitelistToggle: document.getElementById('whitelistToggle'),
        whitelistStatus: document.getElementById('whitelistStatus'),
        addWhitelistBtn: document.getElementById('addWhitelistButton')
    };

    // State Management
    let state = {
        privacyEnabled: false,
        whitelistMode: false,
        totalTrackersBlocked: 0,
        totalCookiesCleared: 0,
        whitelistedSites: []
    };

    function initializeState() {
        chrome.storage.local.get([
            'privacyEnabled',
            'whitelistMode',
            'totalTrackersBlocked',
            'totalCookiesCleared',
            'whitelistedSites'
        ], (result) => {
            state = {
                privacyEnabled: result.privacyEnabled || false,
                whitelistMode: result.whitelistMode || false,
                totalTrackersBlocked: result.totalTrackersBlocked || 0,
                totalCookiesCleared: result.totalCookiesCleared || 0,
                whitelistedSites: result.whitelistedSites || []
            };
            updateUI();
        });
    }

    function updateUI() {
        elements.privacyToggle.checked = state.privacyEnabled;
        elements.privacyStatus.textContent = state.privacyEnabled ? 
            "Privacy Shield Active" : "Privacy Shield Inactive";

        elements.whitelistToggle.checked = state.whitelistMode;
        elements.whitelistStatus.textContent = state.whitelistMode ? 
            "Whitelist Mode Enabled" : "Whitelist Mode Disabled";

        elements.trackerCount.textContent = state.totalTrackersBlocked;
        elements.cookieCount.textContent = state.totalCookiesCleared;
    }

    function togglePrivacy() {
        state.privacyEnabled = elements.privacyToggle.checked;
        chrome.storage.local.set({ privacyEnabled: state.privacyEnabled });
        chrome.runtime.sendMessage({ 
            action: state.privacyEnabled ? "enablePrivacy" : "disablePrivacy" 
        });
        updateUI();
    }

    function toggleWhitelistMode() {
        state.whitelistMode = elements.whitelistToggle.checked;
        chrome.storage.local.set({ whitelistMode: state.whitelistMode });
        chrome.runtime.sendMessage({ 
            action: state.whitelistMode ? "enableWhitelist" : "disableWhitelist" 
        });
        updateUI();
    }

    async function handleCookieClear() {
        elements.clearCookiesBtn.disabled = true;
        elements.clearCookiesBtn.textContent = "Clearing...";

        const cookies = await chrome.cookies.getAll({});
        let clearedCount = 0;

        for (const cookie of cookies) {
            const url = `${cookie.secure ? "https://" : "http://"}${cookie.domain}${cookie.path}`;
            await chrome.cookies.remove({ url, name: cookie.name });
            clearedCount++;
        }

        state.totalCookiesCleared += clearedCount;
        chrome.storage.local.set({ totalCookiesCleared: state.totalCookiesCleared });
        updateUI();

        elements.clearCookiesBtn.textContent = `Cleared ${clearedCount} Cookies!`;
        setTimeout(() => {
            elements.clearCookiesBtn.disabled = false;
            elements.clearCookiesBtn.textContent = "Clear Cookies";
        }, 2000);
    }

    function addCurrentSiteToWhitelist() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            
            const url = new URL(tabs[0].url);
            const domain = url.hostname;

            if (!state.whitelistedSites.includes(domain)) {
                state.whitelistedSites.push(domain);
                chrome.storage.local.set({ whitelistedSites: state.whitelistedSites });
                alert(`${domain} added to whitelist!`);
            } else {
                alert(`${domain} is already in the whitelist.`);
            }
        });
    }

    // Event Listeners
    elements.privacyToggle.addEventListener('change', togglePrivacy);
    elements.whitelistToggle.addEventListener('change', toggleWhitelistMode);
    elements.clearCookiesBtn.addEventListener('click', handleCookieClear);
    elements.addWhitelistBtn.addEventListener('click', addCurrentSiteToWhitelist);

    // Initialize
    initializeState();
});
