const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
if (toggle && mobileNav) {
  const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); mobileNav.hidden = true; };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
  });
  mobileNav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width: 561px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
}
const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
let clearCopyStatus;
copyButton?.addEventListener('click', async () => {
  clearTimeout(clearCopyStatus);
  try {
    await navigator.clipboard.writeText('f20240732@pilani.bits-pilani.ac.in');
    copyStatus.textContent = 'Email copied. Say hello!';
    copyButton.setAttribute('aria-label', 'Email address copied');
  } catch {
    copyStatus.textContent = 'Select the email address above to copy it.';
  }
  clearCopyStatus = setTimeout(() => { copyStatus.textContent = ''; copyButton.setAttribute('aria-label', 'Copy email address'); }, 5000);
});
const timeElement = document.querySelector('#local-time');
function updateTime() {
  if (!timeElement) return;
  const date = new Date();
  timeElement.textContent = new Intl.DateTimeFormat('en-IN', {timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:true}).format(date) + ' IST';
  timeElement.dateTime = date.toISOString();
}
updateTime();
if (timeElement) setInterval(updateTime, 60000);
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
