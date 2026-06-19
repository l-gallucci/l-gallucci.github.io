// === Expeditions — dark world map + data-driven cards ===
// Reads /assets/data/expeditions.json (id, name, year, region, ship,
// description, coords [lat,lon], logo, status). Renders Leaflet markers
// (cyan; "future" = hollow ring) with logo popups, and fills the
// Past / Upcoming lists from the same data. No connecting routes.
(function(){
  function esc(s){ return (s==null?'':String(s)).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }

  document.addEventListener('DOMContentLoaded', function(){
    if(!document.getElementById('map')) return;
    if(typeof L === 'undefined'){
      var css=document.createElement('link'); css.rel='stylesheet';
      css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(css);
      var js=document.createElement('script'); js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      js.onload=boot; document.body.appendChild(js);
    } else { boot(); }
  });

  function boot(){
    fetch('/assets/data/expeditions.json')
      .then(function(r){ return r.json(); })
      .then(function(exps){ renderMap(exps); renderLists(exps); })
      .catch(function(e){ console.error('expeditions.json load failed', e); });
  }

  function renderMap(exps){
    var map = L.map('map', { worldCopyJump:true, scrollWheelZoom:false, minZoom:1, maxZoom:8 }).setView([30,5], 1);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains:'abcd', maxZoom:8,
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    var pts=[];
    exps.forEach(function(e){
      if(!e.coords) return;
      var future = e.status==='future';
      L.circleMarker(e.coords, {
        radius:7, color:'#36b6a6', weight:future?1.6:1,
        fillColor:'#36b6a6', fillOpacity:future?0:0.9
      }).addTo(map).bindPopup(
        '<div class="exp-pop"><img src="'+e.logo+'" alt="">'+
        '<div class="nm">'+esc(e.name)+'</div>'+
        '<div class="mt">'+esc(e.year)+' · '+esc(e.ship)+'</div>'+
        '<div class="rg">'+esc(e.region)+'</div>'+
        (e.description ? '<div class="ds">'+esc(e.description)+'</div>' : '')+
        '<div class="st">'+(future?'Upcoming expedition':'Completed expedition')+'</div></div>',
        { closeButton:true, autoClose:true, className:'expedition-popup' }
      );
      pts.push(e.coords);
    });
    if(pts.length){
      map.fitBounds(pts, { padding:[44,44], maxZoom:3 });
      setTimeout(function(){ map.invalidateSize(); map.fitBounds(pts, { padding:[44,44], maxZoom:3 }); }, 350);
    }
  }

  function renderLists(exps){
    var past = exps.filter(function(e){ return e.status!=='future'; })
                   .sort(function(a,b){ return (b.year||0)-(a.year||0); });
    var future = exps.filter(function(e){ return e.status==='future'; })
                     .sort(function(a,b){ return (a.year||0)-(b.year||0); });
    fill('exp-past', past);
    fill('exp-upcoming', future);
  }

  function fill(id, list){
    var el = document.getElementById(id);
    if(!el) return;
    if(!list.length){ el.innerHTML = '<div class="empty-state"><b>Nothing here yet.</b></div>'; return; }
    el.innerHTML = list.map(function(e){
      return '<div class="exp"><div class="when">'+esc(e.year)+'</div>'+
        '<div class="exp-main"><div class="exp-head">'+
        '<img class="exp-logo" src="'+e.logo+'" alt="">'+
        '<div><h3>'+esc(e.name)+'</h3>'+
        '<div class="where">'+esc(e.region)+' · '+esc(e.ship)+'</div></div></div>'+
        (e.description ? '<p>'+esc(e.description)+'</p>' : '')+
        '</div></div>';
    }).join('');
  }
})();
