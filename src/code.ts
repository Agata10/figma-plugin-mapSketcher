figma.showUI(__html__, { themeColors: false, height: 500 });

figma.ui.onmessage = (message) => {
  console.log("got this from the UI", message);
  figma.closePlugin();
};
