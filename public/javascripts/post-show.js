mapboxgl.accessToken = 'pk.eyJ1IjoiZmFydWstbWFwYm94IiwiYSI6ImNrN3g5OHQ4aDA5dmozaHM4c2dranA2bGcifQ.JKr6RVv52g3Hx4gPMgXnwg';
    
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: post.coordinates,
      zoom: 5
    });
    
    // create a HTML element for our post location/marker
    const el = document.createElement('div');
    el.className = 'marker';
    
    // make a marker for our location and add to the map
    new mapboxgl.Marker(el)
    .setLngLat(post.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
    .addTo(map);