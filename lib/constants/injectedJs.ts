export const INJECTED_JS = `
(function() {
  var sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.style.display = 'none';

  var logo = document.getElementById('logo');
  if (logo) logo.style.display = 'none';

  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.background = '#000';
  document.body.style.overflow = 'hidden';

  var main = document.querySelector('section.main');
  if (main) {
    main.style.margin = '0';
    main.style.padding = '0';
  }

  var content = document.getElementById('content');
  if (content) {
    content.style.display = 'flex';
    content.style.width = '100vw';
    content.style.height = '100vh';
    content.style.margin = '0';
    content.style.padding = '0';
  }

  var figure = document.querySelector('figure');
  if (figure) {
    figure.style.width = '100vw';
    figure.style.height = '100vh';
    figure.style.margin = '0';
    figure.style.padding = '0';
    figure.style.overflow = 'hidden';
  }

  var closeBtn = document.getElementById('close-stream');
  if (closeBtn) closeBtn.style.display = 'none';

  var saveBtn = document.getElementById('save-still');
  if (saveBtn) saveBtn.style.display = 'none';

  var streamBtn = document.getElementById('toggle-stream');
  if (streamBtn) streamBtn.click();

  setTimeout(function() {
    var streamImg = document.getElementById('stream');
    if (streamImg) {
      streamImg.style.width = '100vw';
      streamImg.style.height = '100vh';
      streamImg.style.objectFit = 'cover';
      streamImg.style.marginTop = '0';
      streamImg.style.borderRadius = '0';
      streamImg.style.display = 'block';
    }

    var streamContainer = document.getElementById('stream-container');
    if (streamContainer) {
      streamContainer.style.width = '100vw';
      streamContainer.style.height = '100vh';
      streamContainer.style.minWidth = 'unset';
      streamContainer.style.margin = '0';
      streamContainer.style.padding = '0';
    }
  }, 500);

  window.ReactNativeWebView.postMessage('loaded');
})();
true;
`;