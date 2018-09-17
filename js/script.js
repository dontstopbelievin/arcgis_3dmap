var map;
var timer;
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;
require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/WebScene",
    "esri/widgets/BasemapGallery",
    "dojo/promise/all",
    "dojo/domReady!"
], function(Map, SceneView, WebScene, BasemapGallery, all) {

  var map = new Map({
    basemap: "streets",
    ground: "world-elevation"
  });

  var scene = new WebScene({
    portalItem: {
      id: "b84f693295d64d45bd8e089a2fd2d1b6"
    }
  });

  var view = new SceneView({
    map: scene,
    container: "map"
  });

  var basemapGallery = new BasemapGallery({
    view: view
  });

  // Add widget to the top right corner of the view
  view.ui.add(basemapGallery, {
    position: "top-right"
  });

    var fulls = document.getElementById("fullscreen_button");
    var zoom_in = document.getElementById("zoom_in");
    var zoom_out = document.getElementById("zoom_out");
    var layers_button = document.getElementById("layers_button");
    var layers_hidden = true;
    dragElement(document.getElementById("my_layers_panel"));
    var measurement_button = document.getElementById("measurement_button");
    var measurement_hidden = true;
    dragElement(document.getElementById("my_measurement_panel"));

    scene.load()
    .then(function() {
      // load the basemap to get its layers created
      console.log("basmap load");
      document.getElementById('main_loading').style.display = 'none';
      fulls.style.visibility = "visible";
      fulls.addEventListener("click", openFullscreen);
      zoom_in.style.visibility = "visible";
      zoom_in.addEventListener("click", my_zoom_in);
      zoom_out.style.visibility = "visible";
      zoom_out.addEventListener("click", my_zoom_out);
      layers_button.style.visibility = "visible";
      layers_button.addEventListener("click", openLayers);
      measurement_button.style.visibility = "visible";
      measurement_button.addEventListener("click", openMeasurements);
      return scene.basemap.load();
    })
    .then(function() {
      // grab all the layers and load them
      var allLayers = scene.allLayers;
      var promises = allLayers.map(function(layer) {
        return layer.load();
      });
      return all(promises.toArray());
    })
    .then(function(layers) {
      // each layer load promise resolves with the layer
      console.log("all " + layers.length + " layers loaded");
    })
    .catch(function(error) {
      console.log("catching error");
      console.error(error);
    });

    function my_zoom_in(){

    }

    function my_zoom_out(){

    }

    function openLayers() {
      if(layers_hidden){
        document.getElementById('my_layers_panel').style.visibility = "visible";
        layers_hidden=false;
      }else{
        document.getElementById('my_layers_panel').style.visibility = "hidden";
        layers_hidden=true;
      }
    }

    function openMeasurements() {
      if(measurement_hidden){
        document.getElementById('my_measurement_panel').style.visibility = "visible";
        measurement_hidden=false;
      }else{
        document.getElementById('my_measurement_panel').style.visibility = "hidden";
        measurement_hidden=true;
      }
    }

    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      }else if(document.getElementsByClassName("sizer")[0]){
        document.getElementsByClassName("sizer")[0].onmousedown = dragMouseDown;
      }
      /*else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }*/

      function dragMouseDown(e) {
        document.getElementsByClassName("pointer")[0].style.visibility = "hidden";
        document.getElementsByClassName("outerPointer")[0].style.visibility = "hidden";
        //console.log(document.getElementsByClassName("esriPopupWrapper")[0].style.right);
        if(document.getElementsByClassName("esriPopupWrapper")[0].style.right == '16px'){
          document.getElementsByClassName("esriPopupWrapper")[0].style.left = '-'+(document.getElementsByClassName("esriPopupWrapper")[0].clientWidth+16)+'px';
          document.getElementsByClassName("esriPopupWrapper")[0].style.right = "auto";
        }else if(document.getElementsByClassName("esriPopupWrapper")[0].style.bottom == '17px'){
          document.getElementsByClassName("esriPopupWrapper")[0].style.top = '-'+(document.getElementsByClassName("esriPopupWrapper")[0].clientHeight+17)+'px';
          document.getElementsByClassName("esriPopupWrapper")[0].style.bottom = "auto";
        }

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }

    /* View in fullscreen */
    function openFullscreen() {
      var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement ||
        document.webkitFullscreenElement || document.msFullscreenElement;
      var fulls_event_open = elem.requestFullscreen || elem.mozRequestFullScreen ||
        elem.webkitRequestFullscreen || elem.msRequestFullscreen;
      var fulls_event_close = document.exitFullscreen || document.mozCancelFullScreen ||
        document.webkitExitFullscreen || document.msExitFullscreen;
      if (fullscreenElement) {
        switch(fulls_event_close){
          case document.exitFullscreen:
            document.exitFullscreen();
            break;
          case document.mozCancelFullScreen:
            document.mozCancelFullScreen();
            break;
          case document.webkitExitFullscreen:
            document.webkitExitFullscreen();
            break;
          case document.msExitFullscreen:
            document.msExitFullscreen();
            break;
          default:
            console.log("error");
        }
      } else {
        switch(fulls_event_open){
          case elem.requestFullscreen:
            elem.requestFullscreen();
            break;
          case elem.mozRequestFullScreen:
            elem.mozRequestFullScreen();
            break;
          case elem.webkitRequestFullscreen:
            elem.webkitRequestFullscreen();
            break;
          case elem.msRequestFullscreen:
            elem.msRequestFullscreen();
            break;
          default:
            console.log("error");
        }
      }
    }

});
