/* ============ STATE ============ */
  let lang = localStorage.getItem('lang') || 'en';
  let theme = localStorage.getItem('theme') || 'dark';
  const t = k => (I18N[k] ? I18N[k][lang] : k);
  const initials = n => n.replace(/[^A-Za-z؀-ۿ ]/g,'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();

  /* ============ STORE MERGE ============ */
  const PKG_MAP = {
    'Ekhsemli':'com.headshot.discountforme',
    'King Salman Social Center':'com.aait.kssc',
    'Morsaal Awamer':'com.aait.marsol',
    'Lyakon User':'com.aait.lyakon.user',
    'Lyakon Doctor':'com.aait.lyakon.doctor',
    'Suq Alhawtih':'com.aait.souq_alhota',
    'Last One Hour':'com.aait.loh',
    'TAAT Client':'com.YR.taat.client',
    'TAAT Captain':'com.YR.taat.captains',
  };
  function mergeStore(){
    PROJECTS.forEach(p=>{
      const pk = p.pkg || PKG_MAP[p.name];
      if(pk && STORE[pk]){
        const s = STORE[pk];
        p.pkg = pk; p.verified = true;
        p.icon = s.icon; p.shots = (s.shots||[]).map(u=>u.replace('=w1052-h592','=w1052-h592'));
        p.url = 'https://play.google.com/store/apps/details?id='+pk;
        p.storeDesc = { en:(s.de||p.desc.en), ar:(s.da||p.desc.ar) };
        p.dl = DL[pk] || p.dl;
      }
    });
  }

  /* ============ RENDER ============ */
  function renderMarquee(){
    const row = TECH.map(x=>`<span class="mtag">${x}</span>`).join('');
    document.getElementById('marquee').innerHTML = row + row;
  }
  function renderTimeline(){
    document.getElementById('timeline').innerHTML = EXPERIENCE.map(e=>`
      <div class="tl-item reveal">
        <div class="tl-card glass">
          <div class="tl-top">
            <div><div class="tl-role">${e.role[lang]}</div><div class="tl-co">${e.co} · ${e.loc[lang]}</div></div>
            <div class="tl-meta">${e.period[lang]}</div>
          </div>
          <ul>${e.points[lang].map(p=>`<li>${p}</li>`).join('')}</ul>
          <div class="tl-tags">${e.tags.map(x=>`<span>${x}</span>`).join('')}</div>
        </div>
      </div>`).join('');
  }
  function renderFilters(){
    const cats = ['all', ...Object.keys(CAT)];
    document.getElementById('filters').innerHTML = cats.map((c,i)=>
      `<button class="filter ${i===0?'active':''}" data-cat="${c}">${c==='all'?t('all'):CAT[c][lang]}</button>`).join('');
    document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{
      document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); renderProjects(b.dataset.cat);
    });
  }
  function renderProjects(filter='all'){
    const list = PROJECTS.filter(p=>filter==='all'||p.cat===filter);
    const grid = document.getElementById('projectGrid');
    grid.innerHTML = list.map(p=>{
      const cat = CAT[p.cat];
      const ios = p.url.includes('apps.apple');
      const iconHtml = p.icon
        ? `<div class="app-icon"><img src="${p.icon}" alt="${p.name}" loading="lazy" onerror="this.parentNode.innerHTML='${initials(p.name)}';this.parentNode.style.background='linear-gradient(135deg,${cat.c},${cat.c}99)'"></div>`
        : `<div class="app-icon" style="background:linear-gradient(135deg,${cat.c},${cat.c}99)">${initials(p.name)}</div>`;
      return `<div class="pcard-app glass reveal in" data-pi="${PROJECTS.indexOf(p)}">
        <div class="pcard-head">${iconHtml}
          <div><div class="pcard-title">${lang==='ar'?p.nameAr:p.name} ${p.verified?`<span class="verified">● ${t('verified')}</span>`:''}</div>
          <div class="pcard-co">${p.co}${p.dl?` · <span class="pcard-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>${p.dl}</span>`:''}</div></div></div>
        <span class="pcat" style="background:${cat.c}1f;color:${cat.c}">${cat[lang]}</span>
        <p class="pcard-desc">${p.desc[lang]}</p>
        <div class="pcard-tech">${p.tech.map(x=>`<span>${x}</span>`).join('')}</div>
        <a class="pcard-link" href="${p.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${ios?t('viewios'):t('view')}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg></a>
      </div>`;
    }).join('');
    document.querySelectorAll('.pcard-app').forEach(c=>c.onclick=()=>openProjectModal(+c.dataset.pi));
    observeReveal();
  }

  /* ============ PROJECT MODAL ============ */
  function openProjectModal(pi){
    const p = PROJECTS[pi]; if(!p) return;
    const cat = CAT[p.cat], ios = p.url.includes('apps.apple');
    const iconHtml = p.icon
      ? `<div class="app-icon"><img src="${p.icon}" alt="${p.name}"></div>`
      : `<div class="app-icon" style="background:linear-gradient(135deg,${cat.c},${cat.c}99)">${initials(p.name)}</div>`;
    document.getElementById('mHero').innerHTML = `${iconHtml}
      <div><h3>${lang==='ar'?p.nameAr:p.name}</h3><div class="mh-co">${p.co}</div></div>`;
    document.getElementById('mMeta').innerHTML = `
      <span style="color:${cat.c}">${cat[lang]}</span>
      <span>${ios?'iOS':t('android')}</span>
      ${p.dl?`<span class="dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>${p.dl} ${t('downloads')}</span>`:''}
      ${p.verified?`<span class="gp">● ${t('free')}</span>`:''}
      ${p.genre?`<span>${p.genre}</span>`:''}`;
    const shots = document.getElementById('mShots');
    if(p.shots && p.shots.length){
      shots.className = 'modal-shots';
      shots.innerHTML = p.shots.map(s=>`<img src="${s}" alt="${p.name} screenshot" loading="lazy">`).join('');
    } else {
      shots.className = 'modal-shots empty';
      shots.innerHTML = `<div class="shots-empty">${t('noshots')}</div>`;
    }
    document.getElementById('mAboutLabel').textContent = t('about');
    document.getElementById('mDesc').textContent = (p.storeDesc ? p.storeDesc[lang] : p.desc[lang]);
    document.getElementById('mTech').innerHTML = p.tech.map(x=>`<span>${x}</span>`).join('');
    document.getElementById('mFoot').innerHTML = `
      <a class="btn btn-primary" href="${p.url}" target="_blank" rel="noopener">${ios?t('onios'):t('onstore')}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M7 17 17 7M7 7h10v10"/></svg></a>
      <button class="btn btn-ghost" onclick="closeModal()">${t('closebtn')}</button>`;
    const m = document.getElementById('modal');
    m.classList.add('open'); m.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll');
  }
  function closeModal(){
    const m = document.getElementById('modal');
    m.classList.remove('open'); m.setAttribute('aria-hidden','true'); document.body.classList.remove('no-scroll');
  }
  document.getElementById('modalClose').onclick = closeModal;
  document.getElementById('modal').addEventListener('click', e=>{ if(e.target.id==='modal') closeModal(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });
  function renderSkills(){
    document.getElementById('skillGrid').innerHTML = SKILLS.map(s=>`
      <div class="skill-card glass reveal">
        <h3><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${s.ic}</svg></span>${s.t[lang]}</h3>
        <div class="skill-chips">${s.items.map(x=>`<span>${x}</span>`).join('')}</div>
      </div>`).join('');
  }
  function renderEdu(){
    document.getElementById('eduGrid').innerHTML = EDUCATION.map(e=>`
      <div class="edu-card glass reveal">
        <div class="yr">${e.yr}</div><h3>${e.t[lang]}</h3><p>${e.p[lang]}</p>
      </div>`).join('');
  }
  function applyI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const v = I18N[el.getAttribute('data-i18n')];
      if(v) el.innerHTML = v[lang];
    });
  }

  /* ============ THEME / LANG ============ */
  const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  const moon = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  function applyTheme(){
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('themeIcon').innerHTML = theme==='dark'?sun:moon;
    setMapTheme();
  }

  /* ============ REAL MAP (Leaflet + CartoDB) ============ */
  let map, tiles;
  const TILE = {
    dark:  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  };
  const ATTR = '&copy; OSM · CARTO';
  const PICKUP = [24.6886, 46.6890];   // Riyadh
  const DROPOFF = [24.7180, 46.6740];
  function pinIcon(cls){ return L.divIcon({ className:'', html:`<span class="pin ${cls}"></span>`, iconSize:[12,12], iconAnchor:[6,6] }); }
  function initMap(){
    if(typeof L === 'undefined' || map) return;
    map = L.map('ridemap', { zoomControl:false, attributionControl:true, dragging:false,
      scrollWheelZoom:false, doubleClickZoom:false, boxZoom:false, keyboard:false, touchZoom:false, tap:false });
    setMapTheme();
    L.polyline([PICKUP,[24.7010,46.6805],DROPOFF], { color:'#10B981', weight:4, opacity:.95, lineCap:'round' }).addTo(map);
    L.marker(PICKUP, { icon:pinIcon('a') }).addTo(map);
    L.marker(DROPOFF, { icon:pinIcon('b') }).addTo(map);
    map.fitBounds([PICKUP,DROPOFF], { padding:[34,34] });
    setTimeout(()=>map.invalidateSize(), 250);
  }
  function setMapTheme(){
    if(!map) return;
    if(tiles) map.removeLayer(tiles);
    tiles = L.tileLayer(TILE[theme], { attribution:ATTR, subdomains:'abcd', maxZoom:19 }).addTo(map);
  }
  function applyLang(){
    document.documentElement.lang = lang;
    document.documentElement.dir = lang==='ar'?'rtl':'ltr';
    document.getElementById('langBtn').textContent = lang==='ar'?'EN':'ع';
    applyI18n(); renderTimeline(); renderFilters(); renderProjects(); renderSkills(); renderEdu(); renderMarquee();
    observeReveal();
  }
  document.getElementById('themeBtn').onclick=()=>{ theme=theme==='dark'?'light':'dark'; localStorage.setItem('theme',theme); applyTheme(); };
  document.getElementById('langBtn').onclick=()=>{ lang=lang==='ar'?'en':'ar'; localStorage.setItem('lang',lang); applyLang(); };

  /* ============ REVEAL ============ */
  let io;
  function observeReveal(){
    if(!io) io = new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }),{threshold:.12});
    document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));
  }

  /* ============ INIT ============ */
  mergeStore(); initMap(); applyTheme(); applyLang(); observeReveal();
  window.addEventListener('resize', ()=>{ if(map) map.invalidateSize(); });
