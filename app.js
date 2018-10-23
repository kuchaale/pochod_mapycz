document.addEventListener('DOMContentLoaded', function () {
    let markers = [];
    let coordinates = [];

    for (let key in CHECKPOINTS) {
        let checkpoint = CHECKPOINTS[key];
        let coord = SMap.Coords.fromWGS84(CHECKPOINTS[key].coord);
        let marker = createMarker(coord, checkpoint);
        coordinates.push(coord);
        markers.push(marker);
    }

    let map = createMap(markers);
    zoom(map, coordinates);
    renderGdx(map);
});

function createMap(markers) {
    let map = new SMap(JAK.gel("map"), null, 6);
    map.addDefaultControls();
    map.addControl(new SMap.Control.Sync({bottomSpace: 0}));
    map.addDefaultLayer(SMap.DEF_OPHOTO);
    map.addDefaultLayer(SMap.DEF_OPHOTO0203);
    map.addDefaultLayer(SMap.DEF_OPHOTO0406);
    map.addDefaultLayer(SMap.DEF_TURIST);
    map.addDefaultLayer(SMap.DEF_HISTORIC);
    map.addDefaultLayer(SMap.DEF_BASE).enable();
    map.addControl(createLayer(), {left: "8px", top: "9px"});
    map.addLayer(createMarkerLayer(markers)).enable();
    return map;
}

function createLayer() {
    let layer = new SMap.Control.Layer();
    layer.addDefaultLayer(SMap.DEF_BASE);
    layer.addDefaultLayer(SMap.DEF_OPHOTO);
    layer.addDefaultLayer(SMap.DEF_TURIST);
    layer.addDefaultLayer(SMap.DEF_OPHOTO0406);
    layer.addDefaultLayer(SMap.DEF_OPHOTO0203);
    layer.addDefaultLayer(SMap.DEF_HISTORIC);
    return layer;
}

function createMarkerLayer(markers) {
    let markerLayer = new SMap.Layer.Marker();
    for (let i = 0; i < markers.length; i++) {
        markerLayer.addMarker(markers[i]);
    }
    return markerLayer;
}

function createMarker(c, checkpoint) {

    let markerHtml = JAK.mel("div");
    markerHtml.appendChild(createImgHtml());
    markerHtml.appendChild(createLabelHtml());

    const OPTIONS = {
        url: markerHtml,
        title: checkpoint.name,
        anchor: {left: 10, bottom: 1}
    };

    let marker = new SMap.Marker(c, null, OPTIONS);
    marker.decorate(SMap.Marker.Feature.Card, createCardHtml());

    return marker;

    function createImgHtml() {
        return JAK.mel("img", {src: checkpoint.url});
    }

    function createLabelHtml() {
        let labelEl = JAK.mel("div", {}, {
            position: "absolute",
            left: "0px",
            top: "2px",
            textAlign: "center",
            width: "22px",
            color: "white",
            fontWeight: "bold"
        });
        labelEl.innerHTML = checkpoint.letter;
        return labelEl;
    }

    function createCardHtml() {
        let card = new SMap.Card();
        card.getHeader().innerHTML = "<strong>" + checkpoint.name + "</strong>";
        card.getBody().innerHTML = checkpoint.descrip;
        return card;
    }
}

/**
 * Represents point on the map defined with x and y.
 *
 * @param coordinates is array where coordinates[0] is x and coordinates[1] is y
 * @constructor
 */
function Point(coordinates) {
    this.x = coordinates[0];
    this.y = coordinates[1];
}

function zoom(map, coordinates) {
    let centerPoint = new Point(map.computeCenterZoom(coordinates));
    map.setCenterZoom(centerPoint.x, centerPoint.y);
}

function renderGdx(map) {
    const GPX_URL = 'pochod_na_10km.gpx';
    const GPX_OPTIONS = {
        colors: ["red", "green", "blue"]
    };

    let r = new JAK.Request(JAK.Request.XML);

    r.setCallback(function (data) {
        let gpx = new SMap.Layer.GPX(data, null, GPX_OPTIONS);
        map.addLayer(gpx).enable();
        gpx.fit();
    });

    r.send(GPX_URL);
}

const CHECKPOINTS = {
    "start": {
        name: "Start/Cil",
        coord: "49�58.95195'N,15�17.65670'E",
        url: SMap.CONFIG.img + "/marker/drop-blue.png",
        descrip: "Ahoj, ja nejsem <em>obsah vizitky</em>!",
        letter: "S"
    },
    "kostel-sv-stepana": {
        name: "Kostel sv. Štěpána",
        coord: "49�58.00738'N,15�18.28723'E",
        url: SMap.CONFIG.img + "/marker/drop-red.png",
        descrip: "Ahoj, ja jsem <em>obsah vizitky</em>!  <img src='malin_kostel2.jpg' style='width:204.8px; height:409.6px;' />",
        letter: "K/A/Z"
    },
    "hrbitov": {
        name: "Hřbitov",
        coord: "49�58.70253'N,15�17.98887'E",
        url: SMap.CONFIG.img + "/marker/drop-red.png",
        descrip: "Ahoj, ja byl <em>obsah vizitky</em>!  <img src='hlizov_hrbitov.jpg' style='width:403.2px; height:302.4px;' />",
        letter: "K/A"
    },
    "pomnik": {
        name: "Pomník",
        coord: "49�58.01630'N,15�18.14528'E",
        url: SMap.CONFIG.img + "/marker/drop-red.png",
        descrip: "Ahoj, ja byl <em>obsah vizitky</em> <img src='malin_pomnik.jpg' style='width:403.2px; height:302.4px;' />",
        letter: "K/A"
    },
    "kostel-sv-apostolu-jana-pavla": {
        name: "Kostel sv. apoštolů Jana a Pavla",
        coord: "49�58.03493'N,15�18.16912'E",
        url: SMap.CONFIG.img + "/marker/drop-red.png",
        descrip: "Ahoj, ja byl <em>obsah vizitky</em> <img src='malin_kostel1.jpg' style='width:204.8px; height:409.6px;' />",
        letter: "K/A"
    },
    "kostel-martina": {
        name: "Kostel sv. Martina",
        coord: "49�58.23795'N,15�19.40332'E",
        url: SMap.CONFIG.img + "/marker/drop-red.png",
        descrip: "Ahoj, ja byl <em>obsah vizitky</em> <img src='novedvory_kostel1.jpg' style='width:403.2px; height:302.4px;' />",
        letter: "K/A"
    },
    "kostel-anny": {
        name: "Kostel sv. Anny",
        coord: "49�58.33712'N,15�19.55538'E",
        url: SMap.CONFIG.img + "/marker/drop-red.png",
        descrip: "Ahoj, ja byl <em>obsah vizitky</em> <img src='novedvory_kostel2.jpg' style='width:403.2px; height:302.4px;' />",
        letter: "K/A"
    },
    "cerveny-domek": {
        name: "Červený domek",
        coord: "49�59.16427'N,15�19.19715'E",
        url: SMap.CONFIG.img + "/marker/drop-red.png",
        descrip: "Ahoj, ja byl <em>obsah vizitky</em> <img src='cervenydomek.jpg' style='width:403.2px; height:302.4px;' />",
        letter: "K/A"
    }
};