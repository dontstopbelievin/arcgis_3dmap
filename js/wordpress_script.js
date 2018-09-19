var map;
var timer;
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = "";
require([
    "dojo/dom",
    "esri/views/SceneView",
    "esri/WebScene",
    "esri/widgets/BasemapGallery",
    "dojo/promise/all",
    "esri/widgets/LayerList",
    "esri/widgets/Home",
    "esri/widgets/DirectLineMeasurement3D",
    "esri/widgets/AreaMeasurement3D",
    "esri/widgets/Search",
    "dojo/domReady!"
], function(dom, SceneView, WebScene, BasemapGallery, all, LayerList, Home, DirectLineMeasurement3D, AreaMeasurement3D,
    Search)
   {

  var scene = new WebScene({
    portalItem: {
      id: "b84f693295d64d45bd8e089a2fd2d1b6"
    }
  });

  var view = new SceneView({
    map: scene,
    container: "map",
    constraints: {
      altitude:{
        min: 1000,
        max: 250000
      }
    },
    environment: {
      atmosphere: null,
      starsEnabled: false
    }
  });

  view.when(function() {

    var layerList = new LayerList({
      view: view,
      container: "layerList"
    });

    var basemapGallery = new BasemapGallery({
      view: view,
      container: "my_basemap_content"
    });

    var searchWidget = new Search({
      view: view,
      container: "search_content"
    });

    // Set up a home button for resetting the viewpoint to the intial extent
    var homeBtn = new Home({
      view: view
    }, "HomeButton");
  });

  elem = document.getElementById("my_map");
  var fulls = document.getElementById("fullscreen_button");
  var my_basemap = document.getElementById("basemap");
  var basemap_hidden = true;
  dragElement(document.getElementById("my_basemap_panel"));
  var my_search_button = document.getElementById("my_search_button");
  var search_hidden = true;
  dragElement(document.getElementById("my_search_panel"));
  var layers_button = document.getElementById("layers_button");
  var layers_hidden = true;
  dragElement(document.getElementById("my_layers_panel"));
  var measurement_button = document.getElementById("measurement_button");
  var measurement_hidden = true;
  dragElement(document.getElementById("my_measurement_panel"));
  var activeWidget = null;

  scene.load()
  .then(function() {
    // load the basemap to get its layers created
    console.log("basemap load");
    document.getElementById('main_loading').style.display = 'none';
    document.getElementById('HomeButton').style.visibility = 'visible';
    fulls.style.visibility = "visible";
    fulls.addEventListener("click", openFullscreen);
    my_basemap.style.visibility = "visible";
    my_basemap.addEventListener("click", openBasemaps);
    my_search_button.style.visibility = "visible";
    my_search_button.addEventListener("click", openSearch);
    layers_button.style.visibility = "visible";
    layers_button.addEventListener("click", openLayers);
    measurement_button.style.visibility = "visible";
    measurement_button.addEventListener("click", openMeasurements);

    document.getElementById("distanceButton").addEventListener("click", function () {
      setActiveWidget(null);
      if (!this.classList.contains('active')) {
        setActiveWidget('distance');
      } else {
        setActiveButton(null);
      }
    });

    document.getElementById("areaButton").addEventListener("click", function () {
      setActiveWidget(null);
      if (!this.classList.contains('active')) {
        setActiveWidget('area');
      } else {
        setActiveButton(null);
      }
    });

    return scene.basemap.load();
  })
  .then(function() {
    // grab all the layers and load them
    var allLayers = scene.allLayers;
    var promises = allLayers.map(function(layer) {
      //console.log(layer);
      //console.log(layer.title);
      if(layer.uid == '165eab89f87-object-45' || layer.uid == '165eab89f85-object-44' ||
          layer.uid == '165eabf598e-object-1' || layer.uid == '165eabf5993-object-2' ||
          layer.uid == '165eac3abc6-object-3' || layer.id =='1654b83d404-layer-0'){
        layer.visible = false;
      }
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

  function setActiveWidget(type) {
    switch (type) {
      case "distance":
        activeWidget = new DirectLineMeasurement3D({
          view: view
        });
        view.ui.add(activeWidget, "top-right");
        setActiveButton(document.getElementById('distanceButton'));
        break;
      case "area":
        activeWidget = new AreaMeasurement3D({
          view: view
        });
        view.ui.add(activeWidget, "top-right");
        setActiveButton(document.getElementById('areaButton'));
        break;
      case null:
        if (activeWidget) {
          view.ui.remove(activeWidget);
          activeWidget.destroy();
          activeWidget = null;
        }
        break;
    }
  }

  function setActiveButton(selectedButton) {
    // focus the view to activate keyboard shortcuts for sketching
    view.focus();
    var elements = document.getElementsByClassName("active");
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove("active");
    }
    if (selectedButton) {
      selectedButton.classList.add("active");
    }
  }

  function openBasemaps(){
    if(basemap_hidden){
      document.getElementById('my_basemap_panel').style.visibility = "visible";
      basemap_hidden=false;
    }else{
      document.getElementById('my_basemap_panel').style.visibility = "hidden";
      basemap_hidden=true;
    }
  }

  function openSearch(){
    if(search_hidden){
      document.getElementById('my_search_panel').style.visibility = "visible";
      search_hidden=false;
    }else{
      document.getElementById('my_search_panel').style.visibility = "hidden";
      search_hidden=true;
    }
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
