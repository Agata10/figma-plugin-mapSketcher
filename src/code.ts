figma.showUI(__html__, { themeColors: false, height: 500 });

figma.ui.onmessage = (message) => {
  if (message.type === "create-map") {
    console.log("Got this from the UI", message);
    const svgString = `<svg  xmlns="http://www.w3.org/2000/svg"><path d='${message.svgContent}' fill="#D79393" /></svg>`;
    const svgNode = figma.createNodeFromSvg(svgString);
    figma.currentPage.appendChild(svgNode);
    figma.viewport.scrollAndZoomIntoView([svgNode]);
  }
  figma.closePlugin();
};
