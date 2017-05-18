/**
 * Goes up in the nodelist until it finds a link and returns it.
 *
 * This is a recursive function to make sure to handle the
 * `href` attribute of the real link.
 *
 * Example:
 * <a href="#"><code>HTMLAnchorElement</code></a>
 *
 * In this case, the `code` node doesn't have a `href` attribute
 * so it needs to fall back to `a`.
 *
 * @param {object} node The node to get the link from
 * @returns {object} the first node having a `href` property, `undefined` if none
 */
const getLink = node => {
  if (!node) {
    return undefined
  }

  return node.href ? node : getLink(node.parentNode)
}

/**
 * Dispatches the action to event listeners in the background.
 *
 * Fired if the node is clicked pressing the correct key combinaison
 * and is a link.
 * See https://github.com/francoischalifour/incognito-link#usage
 *
 * @param {object} e The event
 */
const onClick = e => {
  if (!e.shiftKey && !e.altKey) {
    return
  }

  const link = getLink(e.target)

  if (!link) {
    return
  }

  e.preventDefault()

  chrome.runtime.sendMessage({
    action: 'CREATE_INCOGNITO_WINDOW',
    url: link.href
  })
}

/*
 * Binds the listener on the document object to intercept any links
 * added in the future.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', onClick)
})
