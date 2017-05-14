/**
 * Checks if the `href` attribute is a real URL.
 *
 * We reject links that cannot be opened in a new window,
 * like empty anchors and scripts.
 *
 * @param {String} href The href value to check
 * @returns {Boolean} `true` if the link is openable, `false` otherwise
 */
const isOpenableURL = href =>
  href.length > 0 &&
  href !== '#' &&
  !href.startsWith('javascript:')

/**
 * Attaches an event listener to a link.
 *
 * It is fired if the link is clicked pressing the
 * correct key combinaison.
 * See https://github.com/francoischalifour/incognito-link#usage
 *
 * This is a recursive function to make sure to handle the
 * `href` attribute of the real node.
 * Example: <a href="#"><em>Child node without `href`</em></a>
 * In this case, the `em` node doesn't have a `href` attribute
 * so it needs to fall back to `a`.
 *
 * @param {String} link The link to attach the event to
 */
const attachEvent = link => {
  const url = link.href

  if (url) {
    link.addEventListener('click', e => {
      if (e.shiftKey && e.altKey) {
        e.preventDefault()

        // Send the action to event listeners in `background.js`
        chrome.runtime.sendMessage({
          action: 'CREATE_INCOGNITO_WINDOW',
          url
        })
      }
    })
  } else {
    attachEvent(link.parentNode)
  }
}

/*
 * We attach a click event to all the elements in the document
 * with a value for the `href` attribute (`document.links`).
 *
 * We also react to any changes in the DOM with `MutationObserver`
 * to listen to any dynamically added links.
 */
document.addEventListener('DOMContentLoaded', () => {
  [...document.links]
    .filter(link => isOpenableURL(link.href))
    .forEach(attachEvent)

  const observer = new MutationObserver(mutations => {
    mutations
      .map(mutation => mutation.target)
      .filter(target => isOpenableURL(target.href))
      .forEach(attachEvent)
  })

  const config = {
    attributes: true,
    attributeFilter: ['href'],
    subtree: true
  }

  observer.observe(document.body, config)
})
