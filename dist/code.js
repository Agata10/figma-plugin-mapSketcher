figma.showUI(__html__, { themeColors: false, height: 350, width: 300 });
figma.ui.onmessage = (message) => {
    if (message.type === "no-preview") {
        figma.ui.resize(300, 350);
    }
    else if (message.type === "preview") {
        figma.ui.resize(650, 400);
    }
    else if (message.type === "create-map") {
        console.log("Got this from the UI", message);
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg"><path d='${message.svgContent}' fill="#D79393" transform="scale(1.2)"/></svg>`;
        const svgNode = figma.createNodeFromSvg(svgString);
        figma.currentPage.appendChild(svgNode);
        figma.viewport.scrollAndZoomIntoView([svgNode]);
        figma.closePlugin();
    }
};
