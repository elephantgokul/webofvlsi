/* =========================================================
   SEARCH.JS — Site-wide search overlay
   Triggered by Ctrl+K / Cmd+K or the search button
   ========================================================= */

var siteIndex = [
  { title:"Home",                  url:"index.html",                  keywords:"home department VLSI siet" },
  { title:"About — VLSI Dept",      url:"index.html#about",            keywords:"about department history vision mission" },
  { title:"HOD Desk",              url:"pages/hod.html",              keywords:"hod head department message professor" },
  { title:"Faculty",               url:"pages/faculty.html",          keywords:"faculty staff professor lecturer teaching" },
  { title:"Laboratories",          url:"pages/labs.html",             keywords:"lab vlsi embedded signals rf iot circuits" },
  { title:"Workshops & FDP",       url:"pages/workshops.html",        keywords:"workshop fdp bootcamp seminar training" },
  { title:"Events",                url:"pages/events.html",           keywords:"events symposium elecnova competition" },
  { title:"Student Achievements",  url:"pages/achievements.html",     keywords:"achievements hackathon coding paper prize" },
  { title:"Department Milestones", url:"pages/achievements.html",     keywords:"nba naac patent research grant mou ranking" },
  { title:"Placements",            url:"pages/placements.html",       keywords:"placement package company salary job" },
  { title:"Alumni",                url:"pages/alumni.html",           keywords:"alumni graduates batch company" },
  { title:"Gallery",               url:"pages/gallery.html",          keywords:"gallery photos events cultural sports" },
  { title:"Notice Board",          url:"pages/notices.html",          keywords:"notice announcement circular exam timetable" },
  { title:"News",                  url:"pages/news.html",             keywords:"news achievement research partnership" },
  { title:"Resources & Downloads", url:"pages/resources.html",        keywords:"notes lab manual question papers syllabus timetable" },
  { title:"Contact Us",            url:"pages/contact.html",          keywords:"contact email phone address map" },
  { title:"Privacy Policy",        url:"pages/privacy.html",          keywords:"privacy policy data cookies" },
];

(function initSearch(){
  /* Inject overlay HTML */
  var overlay = document.createElement("div");
  overlay.id  = "search-overlay";
  overlay.setAttribute("role","dialog");
  overlay.setAttribute("aria-modal","true");
  overlay.setAttribute("aria-label","Site search");
  overlay.innerHTML = [
    '<div id="search-bg"></div>',
    '<div id="search-box">',
      '<div style="display:flex;align-items:center;gap:.75rem;padding:1rem 1.25rem;border-bottom:1px solid #e2e8f0">',
        '<i class="fa-solid fa-magnifying-glass" style="color:#aab4c8;font-size:.9rem;flex-shrink:0"></i>',
        '<input id="search-input" type="search" placeholder="Search pages, labs, placements…" autocomplete="off" spellcheck="false"/>',
        '<button id="search-close" aria-label="Close search">',
          '<span style="font-size:.65rem;font-family:\'IBM Plex Mono\',monospace;padding:.2rem .5rem;border:1px solid #e2e8f0;border-radius:.4rem;color:#aab4c8">ESC</span>',
        '</button>',
      '</div>',
      '<div id="search-results"></div>',
      '<div style="padding:.75rem 1.25rem;border-top:1px solid #e2e8f0;display:flex;gap:1.5rem">',
        '<span style="font-size:.7rem;font-family:\'IBM Plex Mono\',monospace;color:#aab4c8"><kbd style="background:#f4f7fb;padding:.1rem .4rem;border-radius:.3rem;border:1px solid #e2e8f0">↑↓</kbd> Navigate</span>',
        '<span style="font-size:.7rem;font-family:\'IBM Plex Mono\',monospace;color:#aab4c8"><kbd style="background:#f4f7fb;padding:.1rem .4rem;border-radius:.3rem;border:1px solid #e2e8f0">↵</kbd> Open</span>',
        '<span style="font-size:.7rem;font-family:\'IBM Plex Mono\',monospace;color:#aab4c8"><kbd style="background:#f4f7fb;padding:.1rem .4rem;border-radius:.3rem;border:1px solid #e2e8f0">ESC</kbd> Close</span>',
      '</div>',
    '</div>',
  ].join("");
  document.body.appendChild(overlay);

  /* Inject search trigger button into header */
  var srchBtn = document.createElement("button");
  srchBtn.id  = "search-trigger";
  srchBtn.setAttribute("aria-label","Open search");
  srchBtn.setAttribute("title","Search  Ctrl+K");
  srchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass" style="font-size:.85rem"></i>';
  var header = document.querySelector("#site-header .max-w-screen-xl > div.hidden, #site-header .max-w-screen-xl");
  var refBtn  = document.getElementById("menu-toggle");
  if(refBtn && refBtn.parentNode){
    refBtn.parentNode.insertBefore(srchBtn, refBtn);
  }

  /* Styles for overlay + button */
  var style = document.createElement("style");
  style.textContent = [
    "#search-overlay{position:fixed;inset:0;z-index:500;display:flex;align-items:flex-start;justify-content:center;padding:5rem 1rem 1rem;opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s}",
    "#search-overlay.is-open{opacity:1;visibility:visible}",
    "#search-bg{position:absolute;inset:0;background:rgba(11,27,51,.7);backdrop-filter:blur(8px)}",
    "#search-box{position:relative;z-index:1;background:#fff;border-radius:1.25rem;width:100%;max-width:600px;max-height:70vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 40px 80px -20px rgba(11,27,51,.4)}",
    "#search-input{flex:1;border:none;outline:none;font-family:'IBM Plex Sans',sans-serif;font-size:.95rem;color:#0b1b33;background:transparent}",
    "#search-input::placeholder{color:#aab4c8}",
    "#search-results{overflow-y:auto;max-height:380px}",
    ".sr-item{display:flex;align-items:center;gap:.75rem;padding:.85rem 1.25rem;cursor:pointer;transition:background .18s;text-decoration:none}",
    ".sr-item:hover,.sr-item.is-focused{background:#f4f7fb}",
    ".sr-item-icon{width:2rem;height:2rem;border-radius:.6rem;background:#f0f4ff;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
    ".sr-item-title{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:.85rem;color:#0b1b33}",
    ".sr-item-url{font-family:'IBM Plex Mono',monospace;font-size:.7rem;color:#aab4c8;margin-top:.1rem}",
    ".sr-empty{padding:2rem;text-align:center;font-family:'IBM Plex Mono',monospace;font-size:.8rem;color:#aab4c8}",
    "#search-trigger{width:2.25rem;height:2.25rem;border-radius:.65rem;border:none;background:rgba(255,255,255,.12);color:rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s;margin-right:.35rem}",
    "#search-trigger:hover{background:rgba(255,255,255,.22);color:#fff}",
    "#site-header.is-scrolled #search-trigger{background:rgba(11,27,51,.07);color:#5b6478}",
    "#site-header.is-scrolled #search-trigger:hover{background:#1652c4;color:#fff}",
    "#search-close{background:none;border:none;cursor:pointer;padding:.25rem}",
  ].join("");
  document.head.appendChild(style);

  var isOpen = false;
  var focusIdx = -1;

  function open(){ overlay.classList.add("is-open"); document.body.style.overflow="hidden"; isOpen=true; setTimeout(function(){ document.getElementById("search-input").focus(); },50); render(""); }
  function close(){ overlay.classList.remove("is-open"); document.body.style.overflow=""; isOpen=false; document.getElementById("search-input").value=""; focusIdx=-1; }

  function render(q){
    var res = document.getElementById("search-results");
    var matches = q.trim()===""
      ? siteIndex.slice(0,8)
      : siteIndex.filter(function(item){ return (item.title+" "+item.keywords).toLowerCase().includes(q.toLowerCase()); });

    if(!matches.length){ res.innerHTML='<p class="sr-empty">No results for "'+q+'"</p>'; return; }

    var base = location.pathname.includes("/pages/") ? "../" : "";
    res.innerHTML = matches.map(function(item,i){
      return [
        '<a class="sr-item" href="'+base+item.url+'" tabindex="-1" data-idx="'+i+'">',
          '<div class="sr-item-icon"><i class="fa-solid fa-file-lines" style="color:#1652c4;font-size:.8rem"></i></div>',
          '<div>',
            '<p class="sr-item-title">'+item.title+'</p>',
            '<p class="sr-item-url">'+item.url+'</p>',
          '</div>',
        '</a>'
      ].join("");
    }).join("");
    focusIdx=-1;
  }

  document.getElementById("search-input").addEventListener("input", function(){ render(this.value); });
  document.getElementById("search-close").addEventListener("click", close);
  document.getElementById("search-bg").addEventListener("click", close);
  srchBtn.addEventListener("click", open);

  /* Keyboard nav */
  document.addEventListener("keydown", function(e){
    if((e.ctrlKey||e.metaKey)&&e.key==="k"){ e.preventDefault(); isOpen?close():open(); }
    if(!isOpen) return;
    if(e.key==="Escape"){ close(); return; }
    var items = document.querySelectorAll(".sr-item");
    if(!items.length) return;
    if(e.key==="ArrowDown"){ e.preventDefault(); focusIdx=Math.min(focusIdx+1,items.length-1); }
    if(e.key==="ArrowUp")  { e.preventDefault(); focusIdx=Math.max(focusIdx-1,0); }
    items.forEach(function(it,i){ it.classList.toggle("is-focused",i===focusIdx); });
    if(e.key==="Enter"&&focusIdx>=0){ items[focusIdx].click(); close(); }
  });
})();
