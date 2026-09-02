export function initSettingsMenu(){
  const btn = document.getElementById('settingsBtn');
  const menu = document.getElementById('settingsMenu');

  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', (ev) => {
    if (!menu.contains(ev.target) && ev.target !== btn){
      menu.classList.remove('open');
    }
  });

  // Close the menu after any action inside it is clicked.
  menu.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => menu.classList.remove('open'));
  });
}
