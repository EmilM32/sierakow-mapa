window.onload = function(){

  var theurl = 'http://localhost:8080/geoserver/sierakow/wms';

  var view = new ol.View({
      // EPSG:3857 WGS 84 / Pseudo-Mercator
      center: [1790185.72,6918468.25],
      zoom: 13
  });

   var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
        // source: new ol.source.Stamen({layer:'toner'})
      })
    ],
    target: 'map',
    view: view
  });

var drogi_92 = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: theurl,
        params: {'LAYERS': 'sierakow:drogi_92'},
        serverType: 'geoserver'
      })
});

var granice_sierakow = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: theurl,
        params: {'LAYERS': 'sierakow:granice_sierakow'},
        serverType: 'geoserver'
      })
});

var jeziora = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: theurl,
        params: {'LAYERS': 'sierakow:jeziora'},
        serverType: 'geoserver'
      })
});

var drogi_glowne = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: theurl,
        params: {'LAYERS': 'sierakow:drogi_glowne'},
        serverType: 'geoserver'
      })
});

var kolej = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: theurl,
        params: {'LAYERS': 'sierakow:kolej'},
        serverType: 'geoserver'
      })
});

var rzeki_a = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: theurl,
        params: {'LAYERS': 'sierakow:rzeki_a'},
        serverType: 'geoserver'
      })
});

var rzeki_l = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: theurl,
        params: {'LAYERS': 'sierakow:rzeki_l'},
        serverType: 'geoserver'
      })
});

map.addLayer(drogi_92);
map.addLayer(granice_sierakow);
map.addLayer(jeziora);
map.addLayer(drogi_glowne);
map.addLayer(kolej);
map.addLayer(rzeki_a);
map.addLayer(rzeki_l);

map.on('pointermove', function(evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.forEachLayerAtPixel(pixel, function() {
    return true;
  });
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  var coord = evt.coordinate;
  var degrees = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
  var hdms = ol.coordinate.toStringHDMS(degrees);
  document.getElementById("coordinate").innerHTML = hdms;
});

map.on('singleclick', function(evt) {
         document.getElementById('info').innerHTML = '';
         var viewResolution = view.getResolution();
         var url = jeziora.getSource().getGetFeatureInfoUrl(
           evt.coordinate, viewResolution, view.getProjection(),
           {'INFO_FORMAT': 'application/json', 'propertyName': 'nam'});
           if (url) {
            var parser = new ol.format.GeoJSON();
            $.ajax({
              url: url,
              dataType: 'json',
              jsonpCallback: 'parseResponse'
            }).then(function(response) {
              var result = parser.readFeatures(response);
              if (result.length) {
                var inf = [];
                for (var i = 0, ii = result.length; i < ii; ++i) {
                  inf.push(result[i].get('nam'));
                }
                 document.getElementById('info').innerHTML = inf.join(', ');
              } else {
                 document.getElementById('info').innerHTML = '&nbsp;';
              }
            });
          }
      });

var sierakow_granice_checkbox = document.querySelector('#sierakow_granice_checkbox');
var jeziora_checkbox = document.querySelector('#jeziora_checkbox');
var drogi_glowne_checkbox = document.querySelector('#drogi_glowne_checkbox');
var drogi_92_checkbox = document.querySelector('#drogi_92_checkbox');
var kolej_checkbox = document.querySelector('#kolej_checkbox');
var rzeki_a_checkbox = document.querySelector('#rzeki_a_checkbox');
var rzeki_l_checkbox = document.querySelector('#rzeki_l_checkbox');

  sierakow_granice_checkbox.addEventListener('change', function() {
    var checked = this.checked;
    if (checked !== granice_sierakow.getVisible()) {
      granice_sierakow.setVisible(checked);
    }
  });

  granice_sierakow.on('change:visible', function() {
    var visible = this.getVisible();
    if (visible !== sierakow_granice_checkbox.checked) {
      sierakow_granice_checkbox.checked = visible;
    }
  });

  jeziora_checkbox.addEventListener('change', function() {
    var checked = this.checked;
    if (checked !== jeziora.getVisible()) {
      jeziora.setVisible(checked);
    }
  });

  jeziora.on('change:visible', function() {
    var visible = this.getVisible();
    if (visible !== jeziora_checkbox.checked) {
      jeziora_checkbox.checked = visible;
    }
  });

  drogi_glowne_checkbox.addEventListener('change', function() {
    var checked = this.checked;
    if (checked !== drogi_glowne.getVisible()) {
      drogi_glowne.setVisible(checked);
    }
  });

  drogi_glowne.on('change:visible', function() {
    var visible = this.getVisible();
    if (visible !== drogi_glowne_checkbox.checked) {
      drogi_glowne_checkbox.checked = visible;
    }
  });

  drogi_92_checkbox.addEventListener('change', function() {
    var checked = this.checked;
    if (checked !== drogi_92.getVisible()) {
      drogi_92.setVisible(checked);
    }
  });

  drogi_92.on('change:visible', function() {
    var visible = this.getVisible();
    if (visible !== drogi_92_checkbox.checked) {
      drogi_92_checkbox.checked = visible;
    }
  });

  kolej_checkbox.addEventListener('change', function() {
    var checked = this.checked;
    if (checked !== kolej.getVisible()) {
      kolej.setVisible(checked);
    }
  });

  kolej.on('change:visible', function() {
    var visible = this.getVisible();
    if (visible !== kolej_checkbox.checked) {
      kolej_checkbox.checked = visible;
    }
  });

  rzeki_a_checkbox.addEventListener('change', function() {
    var checked = this.checked;
    if (checked !== rzeki_a.getVisible()) {
      rzeki_a.setVisible(checked);
    }
  });

  rzeki_a.on('change:visible', function() {
    var visible = this.getVisible();
    if (visible !== rzeki_a_checkbox.checked) {
      rzeki_a_checkbox.checked = visible;
    }
  });

  rzeki_l_checkbox.addEventListener('change', function() {
    var checked = this.checked;
    if (checked !== rzeki_l.getVisible()) {
      rzeki_l.setVisible(checked);
    }
  });

  rzeki_l.on('chage:visible', function() {
    var visible = this.getVisible();
    if (visible !== rzeki_l_checkbox.checked) {
      rzeki_l_checkbox.checked = visible;
    }
  });

};
