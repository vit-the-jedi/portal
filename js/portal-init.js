"use strict";

const mobileDisclaimer = () => {
  const disclaimerAppended = document.querySelector("#mobile-disclaimer");
  const screenSize = window.innerWidth;
  if (screenSize < 767) {
    if (!disclaimerAppended) {
      const mobileDisclaimerDiv = document.createElement("div");
      mobileDisclaimerDiv.textContent = `🚧 Sorry, but currently this experiment only works on desktop. To experience this project, please come back on a larger device. Mobile support is coming soon! 🚧`;
      mobileDisclaimerDiv.id = "mobile-disclaimer";
      mobileDisclaimerDiv.classList.add("banner");
      document.body.prepend(mobileDisclaimerDiv);
    } else {
      disclaimerAppended.style.display = "block";
    }
  } else {
    if (disclaimerAppended) {
      disclaimerAppended.style.display = "none";
    }
  }
};

window.addEventListener("load", mobileDisclaimer);
window.addEventListener("resize", mobileDisclaimer);

const config = {
  layers: {
    layer1: {
      text: "Layer 1",
      place: "images/nationalgeographic_2751013_4x3.webp",
      //shape: "polygon",
    },
    layer2: {
      text: "Layer 2",
      place: "images/photo-1449824913935-59a10b8d2000.jpeg",
      //shape: "polygon",
    },
    layer3: {
      text: "Layer 3",
      place: "images/ntFmJUZ8tw3ULD3tkBaAtf.jpeg",
      //shape: "circle",
    },
  },
  behavior: {
    clickBehavior: "click",
  },
};
