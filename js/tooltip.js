"use strict";
window.addEventListener("load", function () {
  placeTooltips(toolTipKeys);
});
//pass in div classnames we want to add tooltips to
// const tooltipsToPlace = ['header-text', 'skills-container'];
const tooltipsToPlace = {
  page: "Click and drag to open a portal. Click and drag in the opposite direction to close it!",
};

const toolTipKeys = Object.keys(tooltipsToPlace);

let toolTipInfoAdded = false;

//add tooltips to all divs
const placeTooltips = function (arr) {
  for (const div of arr) {
    const tooltipDiv = document.querySelector(`.${div}`);
    const tooltip = document.createElement("div");
    const tooltipDivBgColor =
      window.getComputedStyle(tooltipDiv).backgroundColor;
    if (
      tooltipDivBgColor === "rgba(0, 0, 0, 0)" ||
      tooltipDivBgColor === "#ffffff"
    ) {
      tooltip.classList.add("dark");
    }
    tooltip.classList.add("tooltip");
    //mouse events
    tooltip.addEventListener("mouseover", function () {
      showTooltipInfo(tooltipDiv, div);
    });
    tooltip.addEventListener("mouseout", function () {
      removeTooltipInfo(tooltipDiv);
    });
    //🛑 touch events - need to look at this
    tooltip.addEventListener("click", function () {
      if (tooltip.nextSibling) {
        showTooltipInfo(tooltipDiv, div);
      }
    });
    tooltipDiv.appendChild(tooltip);
  }
};

const showTooltipInfo = function (parent, info) {
  if (!toolTipInfoAdded) {
    const toolTipInfo = document.createElement("div");
    toolTipInfo.classList.add("tooltip-info");
    toolTipInfo.textContent = `${tooltipsToPlace[info]}`;
    parent.appendChild(toolTipInfo);
    toolTipInfoAdded = true;
  } else {
    toolTipInfoAdded = false;
  }
};

const removeTooltipInfo = function (parent) {
  const existingToolTip = parent.querySelector(".tooltip-info");
  if (existingToolTip) {
    existingToolTip.remove();
  }
  toolTipInfoAdded = false;
};
