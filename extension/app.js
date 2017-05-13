/**
 * Sends the action `createWindow` to event listeners in `background.js`.
 *
 * This is a recursive function in order to be sure to handle the
 * `href` attribute of the actual link (the direct parent most of the time).
 *
 * Example: <a href="#"><code>Parent node link</code></a>
 */
const createWindow = target => {
  const url = target.href

  if (url) {
    chrome.runtime.sendMessage({
      action: 'createWindow',
      url
    })
  } else {
    createWindow(target.parentNode)
  }
}

/*
 * We attach a click event to all the elements in the document
 * with a value for the href attribute (`document.links`).
 * We execute the script if the link is clicked pressing the
 * correct key combinaison.
 *
 * See https://github.com/francoischalifour/incognito-link#usage
 */
document.addEventListener('DOMContentLoaded', () => {
  for (const link of document.links) {
    link.addEventListener('click', e => {
      if (e.altKey && e.shiftKey) {
        e.preventDefault()
        createWindow(e.target)
      }
    })
  }
})
