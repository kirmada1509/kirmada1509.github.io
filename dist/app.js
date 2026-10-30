const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
let clearCopyStatus;
copyButton?.addEventListener('click', async () => {
  clearTimeout(clearCopyStatus);
  try {
    await navigator.clipboard.writeText('f20240732@pilani.bits-pilani.ac.in');
    copyStatus.textContent = 'Email copied.';
    copyButton.setAttribute('aria-label', 'Email address copied');
  } catch {
    copyStatus.textContent = 'Select the email address to copy it.';
  }
  clearCopyStatus = setTimeout(() => {
    copyStatus.textContent = '';
    copyButton.setAttribute('aria-label', 'Copy email address');
  }, 4000);
});
const timeElement = document.querySelector('#local-time');
function updateTime() {
  if (!timeElement) return;
  const date = new Date();
  timeElement.textContent = new Intl.DateTimeFormat('en-IN', {timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false}).format(date) + ' IST';
  timeElement.dateTime = date.toISOString();
}
updateTime();
if (timeElement) setInterval(updateTime, 60000);
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
// The navigation remains ordinary anchors; this only indicates the current section.
const navLinks = [...document.querySelectorAll('.sidebar nav a')];
if (navLinks.length) {
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let framePending = false;
  const markSection = () => {
    framePending = false;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= innerHeight * 0.35) current = section;
    }
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 5) current = sections.at(-1);
    for (const link of navLinks) {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  addEventListener('scroll', () => {
    if (!framePending) { framePending = true; requestAnimationFrame(markSection); }
  }, {passive:true});
  addEventListener('resize', markSection);
  markSection();
}
