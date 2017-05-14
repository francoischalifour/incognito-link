/*
 * Opens a given url in a new incognito window.
 *
 * Fires when we call `chrome.runtime.sendMessage` in `app.js`.
 */
chrome.runtime.onMessage.addListener(({ action, url }) => {
  if (action === 'CREATE_INCOGNITO_WINDOW') {
    chrome.windows.create({
      url,
      incognito: true
    })
  }
})
