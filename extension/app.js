const ATTEMPTS_MAX = 10

/**
 * Goes up in the tree from a given node and
 * returns the first node being a link.
 *
 * This is a recursive function to make sure to handle the
 * `href` attribute of the real link.
 *
 * It is called maximum `ATTEMPTS_MAX` times.
 *
 * Example: <a href="#"><em>Child node without `href`</em></a>
 * In this case, the `em` node doesn't have a `href` attribute
 * so it needs to fall back to `a`.
 *
 * @param {object} node The node to get the link from
 * @returns {object} the first node having a `href` property
 */
const getLink = (node, noAttemptsLeft = ATTEMPTS_MAX) => {
  if (noAttemptsLeft <= 0 || !node) {
    return undefined
  }

  return node.href ? node : getLink(node.parentNode, --noAttemptsLeft)
}

/**
 * Handles the click event.
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

  // Send the action to event listeners in `background.js`
  chrome.runtime.sendMessage({
    action: 'CREATE_INCOGNITO_WINDOW',
    url: link.href
  })
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', onClick)
})
