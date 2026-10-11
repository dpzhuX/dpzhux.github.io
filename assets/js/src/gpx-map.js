/*
 * gpx-map.js — renders ```gpx fenced blocks as Leaflet maps with an optional photo gallery.
 *
 * Block syntax (inside a ```gpx fence):
 *   track:  /uploads/files/2014/MountWashington.gpx
 *   title:  Mount Washington
 *   tiles:  topo | street          (default: topo)
 *   height: 420                    (pixels, default: 420)
 *   units:  metric | imperial      (default: metric)
 *   photo:  /uploads/images/2014/pic.jpg | Optional caption
 *   photo:  ...                    (repeatable)
 *
 * Loads Leaflet only on pages that actually contain a gpx block.
 */
(function () {
  'use strict';

  var blocks = document.querySelectorAll('.language-gpx');
  if (!blocks.length) { return; }

  var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';
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

  // "path | caption" -> {src, caption}
  function splitCaption(s) {
    var i = s.indexOf('|');
    if (i === -1) { return { src: s.trim(), caption: '' }; }
    return { src: s.slice(0, i).trim(), caption: s.slice(i + 1).trim() };
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

  /* ---------- rendering ---------- */

  function gallery(photos) {
    if (!photos.length) { return null; }
    var wrap = document.createElement('div');
    wrap.className = 'gpx-gallery';
    photos.forEach(function (raw) {
      var p = splitCaption(raw);
      if (!p.src) { return; }
      var fig = document.createElement('figure');
      var a = document.createElement('a');
      a.href = p.src;
      a.target = '_blank';
      a.rel = 'noopener';
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

  function render(block) {
    // The class may sit on the wrapper div (kramdown+rouge) or on <code>; either
    // way we replace the outermost wrapper so the map does not inherit the
    // theme's code-block chrome (grey background, padding, line-number gutter).
    var host = block.closest('.highlighter-rouge') || block;
    var code = block.querySelector('code') || block;   // skips the line-number gutter
    var cfg = parse(code.textContent);
    var src = cfg.track || cfg.gpx;                    // accept either key

    var fig = document.createElement('figure');
    fig.className = 'gpx-figure';

    var photos = gallery(list(cfg.photo).concat(list(cfg.img)));

    if (!src) {
      // No track given — still show the photos rather than nothing.
      if (!photos) { return; }
      fig.appendChild(photos);
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

    if (photos) { fig.appendChild(photos); }
    host.parentNode.replaceChild(fig, host);

    var tiles = TILES[(cfg.tiles || 'topo').toLowerCase()] || TILES.topo;
    var map = L.map(mapEl, { scrollWheelZoom: false });  // don't hijack page scroll
    L.tileLayer(tiles.url, tiles).addTo(map);

    new L.GPX(src, {
      async: true,
      // leaflet-gpx 404s its bundled marker icons unless these are set
      marker_options: { startIconUrl: '', endIconUrl: '', shadowUrl: '' },
      polyline_options: { color: '#d9480f', weight: 4, opacity: 0.85 }
    }).on('loaded', function (e) {
      var gpx = e.target;
      map.fitBounds(gpx.getBounds(), { padding: [14, 14] });
      var s = stats(gpx, (cfg.units || '').toLowerCase() === 'imperial');
      cap.textContent = cfg.title ? cfg.title + '  —  ' + s : s;
    }).on('error', function () {
      cap.textContent = 'Could not load track: ' + src;
      cap.className += ' gpx-error';
    }).addTo(map);
  }

  /* ---------- bootstrap ---------- */

  function script(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    s.onerror = function () {
      Array.prototype.forEach.call(blocks, function (b) {
        b.style.display = 'block';   // fall back to showing the config
      });
    };
    document.head.appendChild(s);
  }

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = CDN + 'leaflet/1.9.4/leaflet.min.css';
  document.head.appendChild(css);

  script(CDN + 'leaflet/1.9.4/leaflet.min.js', function () {
    script(CDN + 'leaflet-gpx/1.7.0/gpx.min.js', function () {
      Array.prototype.forEach.call(blocks, render);
    });
  });
})();
