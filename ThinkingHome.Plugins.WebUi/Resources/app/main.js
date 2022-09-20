/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./frontend/components/Application.tsx":
/*!*********************************************!*\
  !*** ./frontend/components/Application.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Application\": () => (/* binding */ Application),\n/* harmony export */   \"getPages\": () => (/* binding */ getPages)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router */ \"react-router\");\n/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _Page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Page */ \"./frontend/components/Page.tsx\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_3__);\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\n\n\n\n\n\nfunction getPages() {\n    return __awaiter(this, void 0, void 0, function () {\n        var sections;\n        return __generator(this, function (_a) {\n            sections = [\n                {\n                    route: '/moo',\n                    path: '/static/webui/js/moo.js',\n                    name: 'Plugin moo',\n                },\n                {\n                    route: '/hru',\n                    path: '/static/webui/js/moo.js',\n                    name: 'Plugin hru',\n                },\n                {\n                    route: '/meow',\n                    path: '/static/webui/js/moo.js',\n                    name: 'Plugin meow',\n                },\n            ];\n            return [2 /*return*/, Promise.resolve(sections)];\n        });\n    });\n}\nvar Application = function () {\n    var _a = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]), sections = _a[0], setSections = _a[1];\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {\n        getPages().then(setSections);\n    }, []);\n    var routes = sections.map(function (_a) {\n        var path = _a.path, route = _a.route;\n        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router__WEBPACK_IMPORTED_MODULE_1__.Route, { key: route, path: route, element: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Page__WEBPACK_IMPORTED_MODULE_2__.Page, { key: route, path: path }) }));\n    });\n    var links = sections.map(function (_a) {\n        var name = _a.name, route = _a.route;\n        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_3__.NavLink, { key: route, className: \"nav-link\", to: route }, name));\n    });\n    var home = (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", null,\n        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"h1\", null, \"Home\"),\n        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"p\", { className: \"muted\" },\n            \"Placeholder text to demonstrate some \",\n            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", { href: \"#\", \"data-bs-toggle\": \"tooltip\", \"data-bs-title\": \"Default tooltip\" }, \"inline links\"),\n            \" with tooltips. This is now just filler, no killer. Content placed here just to mimic the presence of \",\n            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", { href: \"#\", \"data-bs-toggle\": \"tooltip\", \"data-bs-title\": \"Another tooltip\" }, \"real text\"),\n            \". And all that just to give you an idea of how tooltips would look when used in real-world situations. So hopefully you've now seen how \",\n            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", { href: \"#\", \"data-bs-toggle\": \"tooltip\", \"data-bs-title\": \"Another one here too\" }, \"these tooltips on links\"),\n            \" can work in practice, once you use them on \",\n            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", { href: \"#\", \"data-bs-toggle\": \"tooltip\", \"data-bs-title\": \"The last tip!\" }, \"your own\"),\n            \" site or project.\")));\n    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", null,\n        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"nav\", { className: \"navbar navbar-expand-sm bg-light\" },\n            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", { className: \"container-fluid\" },\n                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_3__.Link, { className: \"navbar-brand\", to: \"/\" }, \"Logo\"),\n                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"button\", { className: \"navbar-toggler\", type: \"button\", \"data-bs-toggle\": \"collapse\", \"data-bs-target\": \"#navbarNavAltMarkup\", \"aria-controls\": \"navbarNavAltMarkup\", \"aria-expanded\": \"false\", \"aria-label\": \"Toggle navigation\" },\n                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"span\", { className: \"navbar-toggler-icon\" })),\n                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", { className: \"collapse navbar-collapse\", id: \"navbarNavAltMarkup\" },\n                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", { className: \"navbar-nav\" },\n                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_3__.NavLink, { className: \"nav-link\", to: '/' }, \"Home\"),\n                        links)))),\n        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", { className: \"container-fluid\" },\n            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router__WEBPACK_IMPORTED_MODULE_1__.Routes, null,\n                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router__WEBPACK_IMPORTED_MODULE_1__.Route, { path: '/', element: home }),\n                routes))));\n};\n\n\n//# sourceURL=webpack://frontend/./frontend/components/Application.tsx?");

/***/ }),

/***/ "./frontend/components/Page.tsx":
/*!**************************************!*\
  !*** ./frontend/components/Page.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Page\": () => (/* binding */ Page)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\n\nvar Page = function (_a) {\n    var path = _a.path;\n    var _b = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined), content = _b[0], setContent = _b[1];\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {\n        import(/*webpackIgnore: true*/ path).then(function (m) {\n            setContent(m.default);\n        });\n    }, [setContent]);\n    if (!content) {\n        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, \"LOADING\");\n    }\n    var Component = content.Component;\n    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Component, null);\n};\n\n\n//# sourceURL=webpack://frontend/./frontend/components/Page.tsx?");

/***/ }),

/***/ "./frontend/index.tsx":
/*!****************************!*\
  !*** ./frontend/index.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ \"react-dom/client\");\n/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_Application__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Application */ \"./frontend/components/Application.tsx\");\n\n\n\n\nvar app = (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode, null,\n    react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.BrowserRouter, null,\n        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Application__WEBPACK_IMPORTED_MODULE_3__.Application, null))));\nvar root = react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot(document.getElementById(\"root\"));\nroot.render(app);\n\n\n//# sourceURL=webpack://frontend/./frontend/index.tsx?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom/client":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "react-router":
/*!******************************!*\
  !*** external "ReactRouter" ***!
  \******************************/
/***/ ((module) => {

module.exports = window["ReactRouter"];

/***/ }),

/***/ "react-router-dom":
/*!*********************************!*\
  !*** external "ReactRouterDOM" ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["ReactRouterDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./frontend/index.tsx");
/******/ 	
/******/ })()
;