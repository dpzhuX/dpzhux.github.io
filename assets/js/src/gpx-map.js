/*
 * gpx-map.js — renders ```gpx-map fenced blocks as Leaflet maps.
 *
 * Block syntax (inside a ```gpx-map fence):
 *   track:  /uploads/files/2014/MountWashington.gpx
 *   title:  Mount Washington
 *   tiles:  topo | street          (default: topo)
 *   height: 420                    (pixels, default: 420)
 *   units:  metric | imperial      (default: metric)
 *   chart:  both | elevation | speed | none   (default: both)
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
  // ODbL (map data) and CC-BY-SA (OpenTopoMap tiles) both require visible
  // credit, so this is as short as it can legitimately get: "Leaflet",
  // "Map data" and "Tiles" are all droppable, the sources are not.
  var OSM = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var TILES = {
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      maxZoom: 17,
      attribution: OSM + ' &middot; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19,
      attribution: OSM
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

  /* ---------- full screen ---------- */

  function fsElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function toggleFullscreen(el) {
    if (fsElement()) {
      var exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) { exit.call(document); }
    } else {
      var req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) { req.call(el); }
    }
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

    // Leaflet rebuilds popup content from the HTML string on open AND on
    // update(), so every handler has to be attached fresh each time.
    function wirePopup(popup) {
      var link = popup.getElement().querySelector('.gpx-popup-link');
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

      // Leaflet measures the popup to decide whether to pan it into view. On a
      // first open the photo has not loaded, so it measures a near-empty box
      // and skips panning. update() re-measures — but it also rewrites the
      // content, which is why the wiring has to be redone straight after.
      var img = link.querySelector('img');
      if (img && !img.complete) {
        img.addEventListener('load', function () {
          popup.update();
          wirePopup(popup);
        }, { once: true });
      }
    }

    map.on('popupopen', function (e) { wirePopup(e.popup); });

    return pts;
  }

  /* ---------- elevation / speed profile ---------- */

  var SVGNS = 'http://www.w3.org/2000/svg';

  function svgEl(name, attrs) {
    var el = document.createElementNS(SVGNS, name);
    for (var k in attrs) {
      if (attrs.hasOwnProperty(k)) { el.setAttribute(k, attrs[k]); }
    }
    return el;
  }

  // leaflet-gpx hangs {time, ele, speed, ...} off every LatLng it parses.
  function trackPoints(gpx) {
    var out = [];
    gpx.getLayers().forEach(function (layer) {
      if (!layer.getLatLngs) { return; }
      (function walk(arr) {
        arr.forEach(function (x) {
          if (Array.isArray(x)) { walk(x); }
          else if (x && x.meta) { out.push(x); }
        });
      })(layer.getLatLngs());
    });
    return out;
  }

  // Cumulative distance plus a smoothed speed — raw GPS speed is far too
  // jittery at 2-second sampling to plot directly.
  function series(points, smooth) {
    var data = [], cum = 0, prev = null;
    points.forEach(function (ll) {
      if (prev) { cum += prev.distanceTo(ll); }
      data.push({ d: cum, ele: ll.meta.ele, spd: ll.meta.speed || 0, ll: ll });
      prev = ll;
    });
    var half = Math.max(1, Math.round(smooth / 2));
    data.forEach(function (p, i) {
      var sum = 0, n = 0;
      for (var j = i - half; j <= i + half; j++) {
        if (j >= 0 && j < data.length) { sum += data[j].spd; n++; }
      }
      p.smooth = n ? sum / n : 0;
    });
    return data;
  }

  function buildChart(gpx, cfg, map) {
    var mode = (cfg.chart || 'both').toLowerCase();
    if (mode === 'none') { return null; }

    var points = trackPoints(gpx);
    if (points.length < 2) { return null; }

    var data = series(points, 15);
    var total = data[data.length - 1].d;
    if (!total) { return null; }

    var imperial = (cfg.units || '').toLowerCase() === 'imperial';
    var dUnit = imperial ? 1609.344 : 1000;
    var dName = imperial ? 'mi' : 'km';
    var eUnit = imperial ? 3.28084 : 1;
    var eName = imperial ? 'ft' : 'm';
    var sUnit = imperial ? 2.236936 : 3.6;      // m/s -> mph / km/h
    var sName = imperial ? 'mph' : 'km/h';

    // Padding has to clear the axis labels at the font set in custom.scss
    // (16px in viewBox units). The SVG clips to the viewBox, so anything that
    // overruns is simply cut off. The right side needs the most room: its
    // widest label is "12.5 km/h" in metric, around 70 units.
    var W = 800, H = 190, PL = 76, PR = 86, PT = 14, PB = 34;
    var pw = W - PL - PR, ph = H - PT - PB;

    var eles = data.map(function (p) { return p.ele; });
    var eMin = Math.min.apply(null, eles), eMax = Math.max.apply(null, eles);
    if (eMax - eMin < 1) { eMax = eMin + 1; }
    var sMax = Math.max.apply(null, data.map(function (p) { return p.smooth; })) || 1;

    var x = function (d) { return PL + (d / total) * pw; };
    var yE = function (e) { return PT + ph - ((e - eMin) / (eMax - eMin)) * ph; };
    var yS = function (s) { return PT + ph - (s / sMax) * ph; };

    // One point per horizontal pixel is plenty; 788 path segments is not.
    var step = Math.max(1, Math.floor(data.length / pw));
    var sampled = data.filter(function (p, i) {
      return i % step === 0 || i === data.length - 1;
    });

    var svg = svgEl('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      class: 'gpx-chart-svg',
      preserveAspectRatio: 'xMidYMid meet'
    });

    var showEle = (mode === 'both' || mode === 'elevation');
    var showSpd = (mode === 'both' || mode === 'speed');

    // Horizontal guides, with each scale labelled top, middle and bottom in
    // its own curve's colour: elevation down the left, speed down the right.
    [0, 0.5, 1].forEach(function (f) {
      var yy = PT + ph * f;
      svg.appendChild(svgEl('line', {
        x1: PL, y1: yy, x2: PL + pw, y2: yy, class: 'gpx-chart-grid'
      }));

      if (showEle) {
        var te = svgEl('text', {
          x: PL - 8, y: yy + 5,
          class: 'gpx-chart-axis gpx-chart-axis-y gpx-chart-axis-e'
        });
        te.textContent = Math.round((eMin + (eMax - eMin) * (1 - f)) * eUnit) +
          (f === 0 ? ' ' + eName : '');
        svg.appendChild(te);
      }

      if (showSpd) {
        var ts = svgEl('text', {
          x: PL + pw + 8, y: yy + 5,
          class: 'gpx-chart-axis gpx-chart-axis-s'
        });
        ts.textContent = (sMax * (1 - f) * sUnit).toFixed(1) +
          (f === 0 ? ' ' + sName : '');
        svg.appendChild(ts);
      }
    });

    // distance ticks
    [0, 0.25, 0.5, 0.75, 1].forEach(function (f) {
      var t = svgEl('text', { x: x(total * f), y: H - 10, class: 'gpx-chart-axis' });
      t.textContent = (total * f / dUnit).toFixed(1) + (f === 1 ? ' ' + dName : '');
      svg.appendChild(t);
    });

    if (showEle) {
      var area = 'M' + x(0) + ',' + (PT + ph);
      sampled.forEach(function (p) { area += 'L' + x(p.d).toFixed(1) + ',' + yE(p.ele).toFixed(1); });
      area += 'L' + x(total) + ',' + (PT + ph) + 'Z';
      svg.appendChild(svgEl('path', { d: area, class: 'gpx-chart-ele' }));
    }

    if (showSpd) {
      var line = '';
      sampled.forEach(function (p, i) {
        line += (i ? 'L' : 'M') + x(p.d).toFixed(1) + ',' + yS(p.smooth).toFixed(1);
      });
      svg.appendChild(svgEl('path', { d: line, class: 'gpx-chart-spd' }));
    }

    // hover cursor, synced with a marker on the map
    var cursor = svgEl('line', {
      x1: PL, y1: PT, x2: PL, y2: PT + ph, class: 'gpx-chart-cursor', opacity: 0
    });
    svg.appendChild(cursor);
    var hit = svgEl('rect', { x: PL, y: PT, width: pw, height: ph, class: 'gpx-chart-hit' });
    svg.appendChild(hit);

    var wrap = document.createElement('div');
    wrap.className = 'gpx-chart';
    wrap.appendChild(svg);
    var read = document.createElement('div');
    read.className = 'gpx-chart-readout';
    read.innerHTML = '&nbsp;';
    wrap.appendChild(read);

    // The x axis is distance, but points are sampled at a constant time
    // interval. Indexing by fraction-of-count therefore drifts from
    // fraction-of-width wherever the pace changed — badly around a rest stop,
    // and back in agreement only at the two ends. Search by distance instead.
    function pointAt(dist) {
      var lo = 0, hi = data.length - 1;
      while (lo < hi) {
        var mid = (lo + hi) >> 1;
        if (data[mid].d < dist) { lo = mid + 1; } else { hi = mid; }
      }
      return data[lo];
    }

    var dot = null;
    function at(evt) {
      var box = svg.getBoundingClientRect();
      var px = ((evt.clientX - box.left) / box.width) * W;
      var frac = Math.min(1, Math.max(0, (px - PL) / pw));
      var p = pointAt(frac * total);
      if (!p) { return; }

      // Pinned to the pointer, not to the matched point, so the line and the
      // cursor can never visibly disagree.
      var cx = PL + frac * pw;
      cursor.setAttribute('x1', cx);
      cursor.setAttribute('x2', cx);
      cursor.setAttribute('opacity', 1);
      read.textContent =
        (p.d / dUnit).toFixed(2) + ' ' + dName + '  ·  ' +
        Math.round(p.ele * eUnit) + ' ' + eName + '  ·  ' +
        (p.smooth * sUnit).toFixed(1) + ' ' + sName;

      if (!dot) {
        dot = L.circleMarker(p.ll, {
          radius: 6, color: '#fff', weight: 2,
          // Blue so it reads as the chart cursor's twin, not as a photo pin.
          fillColor: '#2b6cb0', fillOpacity: 1, interactive: false
        }).addTo(map);
      } else {
        dot.setLatLng(p.ll);
      }
    }

    svg.addEventListener('mousemove', at);
    svg.addEventListener('touchmove', function (ev) {
      if (ev.touches && ev.touches[0]) { at(ev.touches[0]); }
    });
    svg.addEventListener('mouseleave', function () {
      cursor.setAttribute('opacity', 0);
      read.innerHTML = '&nbsp;';
      if (dot) { map.removeLayer(dot); dot = null; }
    });

    return wrap;
  }

  /* ---------- stats banner ---------- */

  function hms(ms) {
    var s = Math.round(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h ? h + 'h ' + m + 'm' : m + 'm ' + (s % 60) + 's';
  }

  function pace(ms) {
    var s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  // Grouped rather than in Gaia's order: shape of the route, then time,
  // then rate. Adjacent tiles stay related however the grid wraps.
  function buildStats(gpx, cfg) {
    var mode = (cfg.stats || 'full').toLowerCase();
    if (mode === 'none') { return null; }

    var imp = (cfg.units || '').toLowerCase() === 'imperial';
    var dist = imp ? gpx.get_distance_imp() : gpx.get_distance() / 1000;
    var up = imp ? gpx.get_elevation_gain_imp() : gpx.get_elevation_gain();
    var down = imp ? gpx.get_elevation_loss_imp() : gpx.get_elevation_loss();
    var mov = gpx.get_moving_time();
    var tot = gpx.get_total_time();
    var dU = imp ? 'mi' : 'km';
    var eU = imp ? 'ft' : 'm';
    var sU = imp ? 'mph' : 'km/h';
    var pU = imp ? 'min/mi' : 'min/km';

    var tiles = [
      [dist.toFixed(2) + ' ' + dU, 'Distance'],
      [Math.round(up) + ' ' + eU, 'Ascent'],
      [Math.round(down) + ' ' + eU, 'Descent']
    ];

    // A track with no <time> gives zero duration; skip what it cannot support.
    if (tot > 0 && mode !== 'basic') {
      tiles.push([hms(mov), 'Moving time']);
      tiles.push([hms(Math.max(0, tot - mov)), 'Stopped']);
      tiles.push([hms(tot), 'Total time']);
      tiles.push([(imp ? gpx.get_moving_speed_imp() : gpx.get_moving_speed()).toFixed(1) + ' ' + sU, 'Moving speed']);
      tiles.push([(imp ? gpx.get_total_speed_imp() : gpx.get_total_speed()).toFixed(1) + ' ' + sU, 'Avg speed']);
      tiles.push([pace(imp ? gpx.get_moving_pace_imp() : gpx.get_moving_pace()) + ' ' + pU, 'Pace']);
    } else if (tot > 0) {
      tiles.push([hms(mov), 'Moving time']);
      tiles.push([pace(imp ? gpx.get_moving_pace_imp() : gpx.get_moving_pace()) + ' ' + pU, 'Pace']);
    }

    var wrap = document.createElement('div');
    wrap.className = 'gpx-stats';
    tiles.forEach(function (t) {
      var cell = document.createElement('div');
      cell.className = 'gpx-stat';
      var v = document.createElement('span');
      v.className = 'gpx-stat-value';
      v.textContent = t[0];
      var l = document.createElement('span');
      l.className = 'gpx-stat-label';
      l.textContent = t[1];
      cell.appendChild(v);
      cell.appendChild(l);
      wrap.appendChild(cell);
    });
    return wrap;
  }

  function render(block) {
    var host = hostOf(block);
    var code = block.querySelector('code') || block;   // skips any line-number gutter
    var cfg = parse(code.textContent);
    var src = cfg.track;

    var photos = list(cfg.photo)
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

    // Order: map, profile, stats, caption, gallery.
    var chartSlot = document.createElement('div');
    fig.appendChild(chartSlot);

    var cap = document.createElement('figcaption');
    cap.className = 'gpx-caption';
    cap.textContent = cfg.title || '';
    fig.appendChild(cap);

    var slot = document.createElement('div');   // holds the unpinned photos
    fig.appendChild(slot);

    host.parentNode.replaceChild(fig, host);

    var tiles = TILES[(cfg.tiles || 'topo').toLowerCase()] || TILES.topo;
    var map = L.map(mapEl, { scrollWheelZoom: true });
    L.tileLayer(tiles.url, tiles).addTo(map);

    // site.use_motion animates post content into place, so the container can
    // still be moving when Leaflet first measures it — a stale measurement
    // leaves the tiles short of the container and the background showing.
    // The "Leaflet" prefix is a courtesy, not a licence term — drop it.
    map.attributionControl.setPrefix('');

    // Collapse the required credit behind an (i). It stays in the DOM for
    // screen readers and expands on hover, tap, or keyboard focus, which is
    // what OSM's guidelines allow for space-constrained maps.
    var attr = map.attributionControl.getContainer();
    attr.className += ' gpx-attr';
    attr.setAttribute('title', 'Map credits');
    L.DomEvent.disableClickPropagation(attr);
    L.DomEvent.on(attr, 'click', function (ev) {
      if (ev.target && ev.target.tagName === 'A') { return; }  // follow credit links
      L.DomEvent.stop(ev);
      var cls = attr.className;
      attr.className = cls.indexOf(' is-open') > -1
        ? cls.replace(' is-open', '')
        : cls + ' is-open';
    });

    var resize = function () { map.invalidateSize(false); };
    setTimeout(resize, 0);
    window.addEventListener('load', resize);

    // Set once the track has loaded; the recentre button is inert until then.
    var homeBounds = null;

    // Full screen and recentre, stacked under Leaflet's own +/- in a matching
    // .leaflet-bar so they read as one control group.
    var canFullscreen = !!(mapEl.requestFullscreen || mapEl.webkitRequestFullscreen);
    var savedHeight = mapEl.style.height;

    var Tools = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function () {
        var bar = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

        if (canFullscreen) {
          var full = L.DomUtil.create('a', 'gpx-ctl', bar);
          full.href = '#';
          full.title = 'Full screen';
          full.setAttribute('role', 'button');
          full.innerHTML = '⛶';          // ⛶
          L.DomEvent.on(full, 'click', function (ev) {
            L.DomEvent.stop(ev);
            toggleFullscreen(mapEl);
          });
        }

        var home = L.DomUtil.create('a', 'gpx-ctl', bar);
        home.href = '#';
        home.title = 'Recentre on the track';
        home.setAttribute('role', 'button');
        home.innerHTML = '⌖';            // ⌖
        L.DomEvent.on(home, 'click', function (ev) {
          L.DomEvent.stop(ev);
          if (homeBounds) { map.fitBounds(homeBounds, { padding: [18, 18] }); }
        });

        L.DomEvent.disableClickPropagation(bar);
        return bar;
      }
    });
    map.addControl(new Tools());

    // The container carries an inline height, which a stylesheet rule could
    // not override — so swap it here rather than fighting it with !important.
    function onFullscreenChange() {
      mapEl.style.height = (fsElement() === mapEl) ? '100%' : savedHeight;
      setTimeout(resize, 0);
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    new L.GPX(src, {
      async: true,
      // leaflet-gpx 404s its bundled marker icons unless these are set
      marker_options: { startIconUrl: '', endIconUrl: '', shadowUrl: '' },
      polyline_options: { color: '#d9480f', weight: 4, opacity: 0.85 }
    }).on('loaded', function (e) {
      var gpx = e.target;
      var bounds = gpx.getBounds();
      // extend() mutates in place, so the pins added later are picked up too.
      homeBounds = bounds;
      resize();
      map.fitBounds(bounds, { padding: [18, 18] });

      try {
        var banner = buildStats(gpx, cfg);
        var chart = buildChart(gpx, cfg, map);
        if (chart) { chartSlot.appendChild(chart); }
        if (banner) { chartSlot.appendChild(banner); }

        // The banner already carries distance, gain and duration, so the
        // caption drops back to just the title rather than repeating them.
        if (!banner) {
          var s = stats(gpx, (cfg.units || '').toLowerCase() === 'imperial');
          cap.textContent = cfg.title ? cfg.title + '  —  ' + s : s;
        }
      } catch (err) {
        if (window.console) { console.error('gpx-map chart:', err); }
        cap.textContent = cfg.title || '';
      }

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
