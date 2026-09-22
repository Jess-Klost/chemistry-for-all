// A "view" is an object describing one screen of an experiment:
//   {
//     html: '<h2 id="stepHeading" tabindex="-1">...</h2>...',
//     onMount: function (container) {wire up addEventListener calls},
//     focusId: 'stepHeading',   // element to move focus to (screen readers
//                               // announce whatever receives focus)
//     status: 'Step 2 of 5'    // short text shown in the persistent status line
//   }
//
// render() swaps a container's contents for a view, wires up its event
// listeners, and moves focus so screen reader users know the page changed
// without needing a full page reload.
var PageBuilder = (function () {
  var statusRegionId = null;

  function init(options) {
    statusRegionId = (options && options.statusRegionId) || null;
  }

  function render(containerId, view) {
    var container = document.getElementById(containerId);
    if (!container || !view) return;

    container.innerHTML = view.html || '';

    if (typeof view.onMount === 'function') {
      view.onMount(container);
    }

    if (view.focusId) {
      focus(view.focusId);
    }

    if (view.status) {
      setText(statusRegionId, view.status);
    }
  }

  function focus(id) {
    var el = document.getElementById(id);
    if (el) el.focus();
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  return { init: init, render: render, focus: focus, setText: setText };
})();
