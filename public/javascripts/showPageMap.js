mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  center: campground.geometry.coordinates,
  zoom: 9,
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
      `<h3>${campground.title}</h3><p><b>${campground.location}</b></p>`
    )
  )
  .addTo(map);
