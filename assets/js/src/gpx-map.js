/*
 * gpx-map.js — renders ```gpx-map fenced blocks as Leaflet maps.
 *
 * Block syntax (inside a ```gpx-map fence):
 *   track:  /uploads/files/2014/MountWashington.gpx
 *   title:  Mount Washington
 *   tiles:  topo | street          (default: topo)
 *   height: 420                    (pixels, default: 420)
 *   units:  metric | imperial      (default: metric)
 *   photo:  /path/pic.jpg @ 44.27,-71.30 | Optional caption
 *
 * A photo is pinned on the map when a location can be resolved for it:
 *   1. an explicit "@ lat,lon" in the line     (always wins)
 *   2. GPS EXIF read from the image itself     (when present)
 * Photos with no resolvable location fall through to a gallery below the map.
 *
 * Clicking a pin opens a thumbnail popup; clicking the thumbnail opens the
 * theme's Fancybox lightbox carrying every photo in the block.
 *
 * Styles: _sass/_custom/custom.scss
 */
(function () {
  'use strict';

  // "gpx-map" rather than "gpx": the block holds config, not GPX source, so no
  // Rouge lexer will ever claim the name and change the markup underneath us.
  var blocks = document.querySelectorAll('.language-gpx-map');
  if (!blocks.length) { return; }

  // Rouge has no "gpx" lexer, so kramdown skips the highlighter and emits a
  // bare <pre><code class="language-gpx-map">. When a lexer does exist it emits
  // <div class="language-x highlighter-rouge"> instead. Replace the outermost
  // wrapper either way — left inside the <pre>, the map inherits the code
  // block's grey padding and its horizontal scrollbar.
  function hostOf(block) {
    return block.closest('.highlighter-rouge') || block.closest('pre') || block;
  }

  // Hide immediately. The stylesheet can only reach the <code>, which would
  // leave an empty grey <pre> on screen until Leaflet arrives from the CDN.
  var hosts = Array.prototype.map.call(blocks, function (b) {
    var h = hostOf(b);
    h.style.display = 'none';
    return h;
  });

  // Must be an explicit value, not ''. Clearing the inline style would hand the
  // element back to the stylesheet's display:none and hide it all over again.
  function reveal(host, message) {
    host.style.display = 'block';
    if (message) {
      var note = document.createElement('p');
      note.className = 'gpx-caption gpx-error';
      note.textContent = message;
      host.parentNode.insertBefore(note, host);
    }
  }

  // Last resort: if a block is still sitting in the DOM well after load, some
  // step failed silently — show its config rather than leaving an empty gap.
  setTimeout(function () {
    hosts.forEach(function (h) { if (h.isConnected) { reveal(h); } });
  }, 8000);

  var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';
  var EXIF_JS = CDN + 'exif-js/2.3.0/exif.min.js';
  var OSM = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var TILES = {
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      maxZoom: 17,
      attribution: 'Map data &copy; ' + OSM +
        ' &middot; Tiles <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19,
      attribution: '&copy; ' + OSM
    }
  };

  /* ---------- parsing ---------- */

  // "key: value" lines; repeated keys collect into an array. Anything else
  // (blank lines, stray gutter line numbers) is ignored.
  function parse(text) {
    var cfg = {};
    text.split('\n').forEach(function (line) {
      var m = line.match(/^\s*([A-Za-z_][\w-]*)\s*:\s*(.+?)\s*$/);
      if (!m) { return; }
      var k = m[1].toLowerCase(), v = m[2];
      if (cfg[k] === undefined) { cfg[k] = v; }
      else if (Array.isArray(cfg[k])) { cfg[k].push(v); }
      else { cfg[k] = [cfg[k], v]; }
    });
    return cfg;
  }

  function list(v) {
    if (v === undefined) { return []; }
    return Array.isArray(v) ? v : [v];
  }

  // "<path> [@ lat,lon] [| caption]"
  function parsePhoto(raw) {
    var s = String(raw), caption = '';
    var bar = s.indexOf('|');
    if (bar !== -1) { caption = s.slice(bar + 1).trim(); s = s.slice(0, bar); }

    var lat = null, lon = null;
    var at = s.match(/@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (at) {
      lat = parseFloat(at[1]);
      lon = parseFloat(at[2]);
      s = s.slice(0, at.index);
    }
    return { src: s.trim(), caption: caption, lat: lat, lon: lon };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function stats(gpx, imperial) {
    var out = [];
    var d = gpx.get_distance();          // metres
    var up = gpx.get_elevation_gain();   // metres
    var ms = gpx.get_total_time();       // milliseconds
    if (imperial) {
      out.push((d / 1609.344).toFixed(1) + ' mi');
      out.push(Math.round(up * 3.28084).toLocaleString() + ' ft gain');
    } else {
      out.push((d / 1000).toFixed(1) + ' km');
      out.push(Math.round(up).toLocaleString() + ' m gain');
    }
    if (ms > 0) {
      var mins = Math.round(ms / 60000);
      out.push(Math.floor(mins / 60) + 'h ' + ('0' + (mins % 60)).slice(-2) + 'm');
    }
    return out.join('  ·  ');
  }

  /* ---------- EXIF ---------- */

  // exif-js hands back [deg, min, sec]; combine with the N/S/E/W reference.
  function fromDms(parts, ref) {
    if (!parts || parts.length < 3) { return null; }
    var d = Number(parts[0]) + Number(parts[1]) / 60 + Number(parts[2]) / 3600;
    if (isNaN(d)) { return null; }
    if (ref === 'S' || ref === 'W') { d = -d; }
    return d;
  }

  // Resolve coordinates for every photo still lacking them, then call done().
  function resolveLocations(photos, done) {
    var pending = photos.filter(function (p) { return p.lat === null && p.src; });
    if (!pending.length || typeof EXIF === 'undefined') { done(); return; }

    var left = pending.length;
    var finish = function () { if (--left === 0) { done(); } };

    pending.forEach(function (p) {
      var probe = new Image();
      probe.onload = function () {
        try {
          EXIF.getData(probe, function () {
            var la = fromDms(EXIF.getTag(this, 'GPSLatitude'), EXIF.getTag(this, 'GPSLatitudeRef'));
            var lo = fromDms(EXIF.getTag(this, 'GPSLongitude'), EXIF.getTag(this, 'GPSLongitudeRef'));
            if (la !== null && lo !== null) { p.lat = la; p.lon = lo; }
            finish();
          });
        } catch (err) { finish(); }
      };
      probe.onerror = finish;
      probe.src = p.src;
    });
  }

  /* ---------- lightbox ---------- */

  // Reuses the theme's Fancybox (loaded globally when site.fancybox is on).
  // Returns false so callers can fall back to the plain href.
  function lightbox(items, index) {
    var jq = window.jQuery;
    if (jq && jq.fancybox) {
      jq.fancybox.open(items, {
        index: index,
        padding: 4,
        helpers: {
          title: { type: 'inside' },
          // Mirrors the theme's own init in utils.js. Without it Fancybox locks
          // the overlay, which drops the scroll position when the lightbox closes.
          overlay: { locked: false }
        }
      });
      return true;
    }
    return false;
  }

  /* ---------- rendering ---------- */

  function gallery(photos, items) {
    if (!photos.length) { return null; }
    var wrap = document.createElement('div');
    wrap.className = 'gpx-gallery';
    photos.forEach(function (p) {
      var fig = document.createElement('figure');
      var a = document.createElement('a');
      a.href = p.src;
      a.target = '_blank';
      a.rel = 'noopener';
      a.onclick = function (ev) { if (lightbox(items, p.index)) { ev.preventDefault(); } };
      var img = document.createElement('img');
      img.src = p.src;
      img.alt = p.caption || '';
      img.loading = 'lazy';
      a.appendChild(img);
      fig.appendChild(a);
      if (p.caption) {
        var cap = document.createElement('figcaption');
        cap.textContent = p.caption;
        fig.appendChild(cap);
      }
      wrap.appendChild(fig);
    });
    return wrap;
  }

  function addPins(map, located, items) {
    var pts = [];
    located.forEach(function (p, i) {
      var icon = L.divIcon({
        className: 'gpx-pin',
        html: '<span>' + (i + 1) + '</span>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      var html =
        '<a class="gpx-popup-link" href="' + escapeHtml(p.src) + '">' +
          '<img src="' + escapeHtml(p.src) + '" alt="' + escapeHtml(p.caption) + '">' +
        '</a>' +
        (p.caption ? '<span class="gpx-popup-cap">' + escapeHtml(p.caption) + '</span>' : '');

      L.marker([p.lat, p.lon], { icon: icon, title: p.caption || '' })
        .addTo(map)
        .bindPopup(html, { minWidth: 220, maxWidth: 260 });

      pts.push([p.lat, p.lon]);
    });

    // Popup DOM is rebuilt on every open, so wire the lightbox each time.
    map.on('popupopen', function (e) {
      var link = e.popup.getElement().querySelector('.gpx-popup-link');
      if (!link) { return; }
      link.onclick = function (ev) {
        var href = link.getAttribute('href');
        var idx = 0;
        located.some(function (p) {
          if (p.src === href) { idx = p.index; return true; }
          return false;
        });
        if (lightbox(items, idx)) { ev.preventDefault(); }
      };
    });

    return pts;
  }

  function render(block) {
    var host = hostOf(block);
    var code = block.querySelector('code') || block;   // skips any line-number gutter
    var cfg = parse(code.textContent);
    var src = cfg.track || cfg.gpx;                    // accept either key

    var photos = list(cfg.photo).concat(list(cfg.img))
      .map(parsePhoto)
      .filter(function (p) { return p.src; });
    photos.forEach(function (p, i) { p.index = i; });

    // Every photo is reachable from the lightbox, pinned or not.
    var items = photos.map(function (p) {
      return { href: p.src, title: p.caption || '' };
    });

    var fig = document.createElement('figure');
    fig.className = 'gpx-figure';

    if (!src) {
      var only = gallery(photos, items);
      if (!only) { return; }
      fig.appendChild(only);
      host.parentNode.replaceChild(fig, host);
      return;
    }

    var mapEl = document.createElement('div');
    mapEl.className = 'gpx-map';
    mapEl.style.height = (parseInt(cfg.height, 10) || 420) + 'px';
    fig.appendChild(mapEl);

    var cap = document.createElement('figcaption');
    cap.className = 'gpx-caption';
    cap.textContent = cfg.title || '';
    fig.appendChild(cap);

    var slot = document.createElement('div');   // holds the unpinned photos
    fig.appendChild(slot);

    host.parentNode.replaceChild(fig, host);

    var tiles = TILES[(cfg.tiles || 'topo').toLowerCase()] || TILES.topo;
    var map = L.map(mapEl, { scrollWheelZoom: false });  // don't hijack page scroll
    L.tileLayer(tiles.url, tiles).addTo(map);

    // site.use_motion animates post content into place, so the container can
    // still be moving when Leaflet first measures it — a stale measurement
    // leaves the tiles short of the container and the background showing.
    var resize = function () { map.invalidateSize(false); };
    setTimeout(resize, 0);
    window.addEventListener('load', resize);

    new L.GPX(src, {
      async: true,
      // leaflet-gpx 404s its bundled marker icons unless these are set
      marker_options: { startIconUrl: '', endIconUrl: '', shadowUrl: '' },
      polyline_options: { color: '#d9480f', weight: 4, opacity: 0.85 }
    }).on('loaded', function (e) {
      var gpx = e.target;
      var bounds = gpx.getBounds();
      resize();
      map.fitBounds(bounds, { padding: [18, 18] });

      var s = stats(gpx, (cfg.units || '').toLowerCase() === 'imperial');
      cap.textContent = cfg.title ? cfg.title + '  —  ' + s : s;

      // EXIF lookups are async, so pins and the gallery land a moment later.
      resolveLocations(photos, function () {
        var located = photos.filter(function (p) { return p.lat !== null; });
        var rest = photos.filter(function (p) { return p.lat === null; });

        var pts = addPins(map, located, items);
        if (pts.length) {
          resize();
          map.fitBounds(bounds.extend(L.latLngBounds(pts)), { padding: [18, 18] });
        }

        var g = gallery(rest, items);
        if (g) { slot.appendChild(g); }
      });
    }).on('error', function () {
      cap.textContent = 'Could not load track: ' + src;
      cap.className += ' gpx-error';
    }).addTo(map);
  }

  /* ---------- bootstrap ---------- */

  function script(src, cb, onfail) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    s.onerror = onfail || cb;   // EXIF is optional; carry on without it
    document.head.appendChild(s);
  }

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = CDN + 'leaflet/1.9.4/leaflet.min.css';
  document.head.appendChild(css);

  script(CDN + 'leaflet/1.9.4/leaflet.min.js', function () {
    script(CDN + 'leaflet-gpx/1.7.0/gpx.min.js', function () {
      script(EXIF_JS, function () {
        Array.prototype.forEach.call(blocks, function (block) {
          // One bad block must not take the rest of the page down with it, and
          // a thrown error must never leave an invisible hole behind.
          try {
            render(block);
          } catch (err) {
            if (window.console) { console.error('gpx-map:', err); }
            reveal(hostOf(block), 'Map failed to render: ' + err.message);
          }
        });
      });
    });
  }, function () {
    // Leaflet itself failed — show the config block rather than an empty gap.
    hosts.forEach(function (h) { reveal(h); });
  });
})();
