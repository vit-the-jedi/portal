"use strict";

const portal = document.getElementById("portal");
const cursorTracker = createNode("div", {
  class: "cursor-tracker",
});
portal.appendChild(cursorTracker);

function createNode(object, attributes) {
  const el = document.createElement(object);
  for (let key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
  return el;
}

//generic PortalLayer to start with
class PortalLayer {
  constructor() {
    this.attributes = {};
    this["attributes"].nodeType = "div";
    this["attributes"].tabIndex = "-1";
    this["attributes"].portalLocation = "";
    this["attributes"].class = "portal-layer";
  }
}

const createPortalLayer = (layer) => {
  //console.log(layer);
  const layerArray = [];
  const layerNode = document.createElement(layer["attributes"].nodeType);
  for (const [attribute, attributeVal] of Object.entries(layer["attributes"])) {
    layerNode.setAttribute(attribute, attributeVal);
  }
  //set the current layer attribute so we can keep track of what to show
  //save it to storage
  if (layer["attributes"].name === "layer1") {
    layerNode.classList.add("current-layer");
    if (sessionStorage.getItem("current-layer") == null) {
      sessionStorage.setItem("current-layer", layer["attributes"].name);
    }
    layerNode.style.transform = `scale(1)`;
  }
  layerArray.push(layerNode);
  layerArray.reverse();
  for (const layerElem of layerArray) {
    portal.appendChild(layerElem);
    layerElem.textContent = `${layer.config.text}`;
  }
};

//loop through config and create portal layers
for (const [name, layerConfig] of Object.entries(config.layers)) {
  const newLayer = new PortalLayer();
  newLayer["attributes"].name = name;
  newLayer["attributes"][
    "style"
  ] = `background: radial-gradient(circle, rgba(255,44,44,0) 0%, rgba(0,0,0,1) 100%), url(${layerConfig.place}) no-repeat center center / cover;`;
  newLayer.config = layerConfig;
  createPortalLayer(newLayer);
}
//change portal layers
let interval = null;
const changePortalLayerHandler = (closePortal) => {
  if (!interval) {
    const currentLayer = document.querySelector(".current-layer");
    const scale =
      currentLayer.getBoundingClientRect().width / currentLayer.offsetWidth;
    if (scale < 1 || closePortal) {
      interval = setInterval(portalLayerAnimation, 150, closePortal);
    } else {
      changePortalLayer();
      interval = setInterval(portalLayerAnimation, 150, closePortal);
    }
  }
};
let count = 0;
const portalLayerAnimation = (closePortal) => {
  if (!closePortal) {
    const layer = document.querySelector(".current-layer");
    const scale = (
      layer.getBoundingClientRect().width / layer.offsetWidth
    ).toFixed(1);
    layer.style.transform = `scale(0.${count})`;
    const clipPathNum = count >= 90 ? count : count / 2;
    layer.style.clipPath = `circle(${clipPathNum}%)`;
    count += 10;
    if (count > 90) {
      stopPortalLayerAnimation();
      layer.style.transform = `scale(1)`;
      count = 0;
    }
  } else if (closePortal) {
    const layer = document.querySelector(".current-layer");
    const scale = (
      layer.getBoundingClientRect().width / layer.offsetWidth
    ).toFixed(1);

    count = scale * 100;
    count -= 10;
    const clipPathNum = count <= 40 ? count : count / 2;
    layer.style.clipPath = `circle(${clipPathNum}%)`;
    layer.style.transform = `scale(0.${count})`;
    if (count == 0) {
      stopPortalLayerAnimation();
      layer.style.transform = `scale(0)`;
    }
  }
};
const stopPortalLayerAnimation = () => {
  clearInterval(interval);
  interval = null;
};
const changePortalLayer = () => {
  const portalLayers = [...document.querySelectorAll(".portal-layer")];
  //need to re-evaluate the current layer bc DOM has been updated
  const currentLayer = document.querySelector(".current-layer");
  const index = portalLayers.indexOf(currentLayer);
  currentLayer.classList.remove("current-layer");
  if (index + 1 < portalLayers.length) {
    portalLayers[index + 1].classList.add("current-layer");
  } else if (index + 1 == portalLayers.length) {
    portalLayers[index].classList.add("current-layer");
  } else {
    return;
  }
  return currentLayer;
};
//track cursor
let cursorPosArr;
const trackCursor = (cursor) => {
  const xPos = cursor.clientX;
  const yPos = cursor.clientY;
  cursorPosArr = [xPos, yPos];
  cursorTracker.style.left = `${xPos - 10}px`;
  cursorTracker.style.top = `${
    yPos + cursorTracker.getBoundingClientRect().height
  }px`;
};
//track click and drag event
const trackPortalMouseEv = (event) => {
  const eventType = event.type;
  const coords = [event.clientX, event.clientY];
  handleDragEvent(coords, eventType);
};
//store drag event coords
const allEventCoords = {};
const mouseMoveHandler = (e) => {
  const currentLayer = document.querySelector(".current-layer");
  const scale =
    currentLayer.getBoundingClientRect().width / currentLayer.offsetWidth;
  const currentLayerName = currentLayer.getAttribute("name");
  const layers = [...document.querySelectorAll(".portal-layer")];
  const lastLayerName = layers[layers.length - 1].getAttribute("name");
  //dont let the portals progress any more if it is last portal and it has been scaled up
  if (currentLayerName === lastLayerName && scale == 1) {
    return;
  } else {
    //set params here so we can pass params through the event listener
    const eventType = e.currentTarget.params["eventType"];
    const coordsArray = e.currentTarget.params["coordsArray"];
    allEventCoords[eventType] = coordsArray;
    const xDifference = cursorPosArr[0] - allEventCoords["mousedown"][0];
    const yDifference = cursorPosArr[1] - allEventCoords["mousedown"][1];
    if (xDifference < 0 || yDifference < 0) {
      if (xDifference <= -10 || yDifference <= -10) {
        changePortalLayerHandler(true);
      }
    } else {
      if (xDifference >= 10 || yDifference >= 10) {
        changePortalLayerHandler(false);
      } else {
        return;
      }
    }
  }
};

const handleDragEvent = (coordsArray, eventType) => {
  //only change portal layers on mouseup (drag complete)
  portal.params = { coordsArray, eventType };
  if (eventType === "mousedown") {
    portal.addEventListener("mousemove", mouseMoveHandler);
  } else if (eventType === "mouseup") {
    stopPortalLayerAnimation();
    portal.removeEventListener("mousemove", mouseMoveHandler);
  }
};
portal.addEventListener("mousedown", trackPortalMouseEv);
portal.addEventListener("mouseup", trackPortalMouseEv);
window.addEventListener("mousemove", trackCursor);
