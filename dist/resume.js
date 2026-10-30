// The simple view has no motion, timers, tracking, weather, or portfolio scripts.
const printButton = document.querySelector('[data-resume-print]');
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());
}
