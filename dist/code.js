/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUF5QixpQ0FBaUM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0EsK0VBQStFLG1CQUFtQjtBQUNsRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maWdtYS1wbHVnaW4tbWFwLXNrZXRjaGVyLy4vc3JjL2NvZGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHRoZW1lQ29sb3JzOiBmYWxzZSwgaGVpZ2h0OiA1MDAgfSk7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwiY3JlYXRlLW1hcFwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290IHRoaXMgZnJvbSB0aGUgVUlcIiwgbWVzc2FnZSk7XG4gICAgICAgIGNvbnN0IHN2Z1N0cmluZyA9IGA8c3ZnICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD0nJHttZXNzYWdlLnN2Z0NvbnRlbnR9JyBmaWxsPVwiI0Q3OTM5M1wiIC8+PC9zdmc+YDtcbiAgICAgICAgY29uc3Qgc3ZnTm9kZSA9IGZpZ21hLmNyZWF0ZU5vZGVGcm9tU3ZnKHN2Z1N0cmluZyk7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLmFwcGVuZENoaWxkKHN2Z05vZGUpO1xuICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW3N2Z05vZGVdKTtcbiAgICB9XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=