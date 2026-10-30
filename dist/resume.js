// The visible Save link works without JavaScript. Also route the save shortcut
// to the same PDF so Ctrl/Cmd+S does not save this page as an HTML document.
const resumeDownload = document.querySelector('[data-resume-download]');
document.addEventListener('keydown', event => {
  if (!resumeDownload || event.defaultPrevented || !(event.ctrlKey || event.metaKey)
    || event.altKey || event.shiftKey || event.key.toLowerCase() !== 's') return;
  event.preventDefault();
  if (!event.repeat) resumeDownload.click();
});
