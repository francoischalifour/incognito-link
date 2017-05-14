/*
 * Runs an action in background.
 *
 * Actions:
 *   - CREATE_INCOGNITO_WINDOW: opens the url in a new Incognito window
 *
 * Fired when we call `chrome.runtime.sendMessage` in `app.js`.
 */
chrome.runtime.onMessage.addListener(({ action, url }) => {
  if (action === 'CREATE_INCOGNITO_WINDOW') {
    chrome.windows.create({
      url,
      incognito: true
    })
  }
})
