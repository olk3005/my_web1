    const fetchAndFilterCities=async() =>{
    const response=await fetch("./data/ne_50m_populated_places.geojson");
    const allCities=await response.json();
    const bigCities={
        ...allCities,
        features: allCities.features.filter(
            (feature) => feature.properties.POP_MAX > 1000000
        ),
        };
         return bigCities;
 };
 const cities=fetchAndFilterCities();
 const getColor=(pop) => {
    return pop >1000000000
    ? [128,0,38]
    : pop >300000000
    ? [128,0,38]
    : pop >100000000
    ? [227,0,38]
    : pop >50000000
    ? [252,0,38]
    : pop >1000000
    ? [254,217,118]
    : [255,237,160];
 };
 const deckgl=new deck.DeckGL({
    style:{
        "background-color": "rgb(137,170,220)"
    },
    //  mapStyle: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
     container: "map",
     initialViewState: {
         latitude: 51,
         longitude: 0,
         zoom: 4,
         bearing: 0,
         pitch: 0
     },
     controller: true,
     getCursor: ({isHovering, isDragging}) =>
     isHovering ? "pointer": isDragging ? "grabbing": "grab",
     layers: [
        new deck.GeoJsonLayer({
            id:"countries",
            data: "./data/ne_50m_admin_0_countries.geojson",
            stroked: true,
            getLineColor:[255,255,255] ,
            lineWidthMinPixels:2,
            filled:true,
            getFillColor: (feature) => getColor(feature.properties.POP_EST),
                 }),
        new deck.GeoJsonLayer({
            id:"rivers",
            data: "./data/ne_50m_rivers_lake_centerlines.geojson",
            getLineColor:[0,0,255] ,
            lineWidthUnits:"pixels",
            linesWidth: 3        
               }),
        new deck.GeoJsonLayer({
            id:"lakes",
            data: "./data/ne_50m_lakes.geojson",
            stroked: true,
            getLineColor:[0,0,255] ,
            lineWidthMinPixels:2,
            getFillColor:[137,170,220],
            filled:true
                }),
        new deck.GeoJsonLayer({
            id:"cities",
            data: cities,
            filled:true,
            pointRadiusUnits:"pixels",
            getPointRadius:12,
            getFillColor:[0,255,255],
            pickable:true,
            autoHighlight:true,
            onClick: (info, event) =>
            (document.getElementById(
            "name"
            ).innerText=`Латинское название города:
            ${info.object.properties.NAME}`),
        }),
       ],
    })