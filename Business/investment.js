(function() {
  const isAuthed = localStorage.getItem('isAuthenticated') === 'true';
  const guestMenu = document.getElementById('navMenuGuest');
  const authMenu = document.getElementById('navMenuAuth');
  const guestActions = document.getElementById('guestActions');
  const authActions = document.getElementById('authActions');
  const logoutBtn = document.getElementById('logoutBtn');
  const drawerGuest = document.getElementById('drawerGuest');
  const drawerAuth = document.getElementById('drawerAuth');
  const drawerLogout = document.getElementById('drawerLogout');

  const applyState = (authed) => {
    if (authed) {
      if (guestMenu) guestMenu.style.display = 'none';
      if (authMenu) authMenu.style.display = '';
      if (guestActions) guestActions.style.display = 'none';
      if (authActions) authActions.style.display = 'flex';
      if (drawerGuest) drawerGuest.style.display = 'none';
      if (drawerAuth) drawerAuth.style.display = 'block';
    } else {
      if (guestMenu) guestMenu.style.display = '';
      if (authMenu) authMenu.style.display = 'none';
      if (guestActions) guestActions.style.display = 'flex';
      if (authActions) authActions.style.display = 'none';
      if (drawerGuest) drawerGuest.style.display = 'block';
      if (drawerAuth) drawerAuth.style.display = 'none';
    }
  };

  applyState(isAuthed);

  const doLogout = () => {
    localStorage.removeItem('isAuthenticated');
    applyState(false);
    window.location.href = 'index.html';
  };

  if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
  if (drawerLogout) drawerLogout.addEventListener('click', doLogout);
})();

(function() {
  const navToggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (!drawer || !overlay) return;
    drawer.classList.add('open');
    overlay.classList.add('show');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!drawer || !overlay) return;
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
})();


