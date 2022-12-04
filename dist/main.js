(function(graph) {
            function require(moduleId) {
                function localRequire(relativePath) {
                    return require(graph[moduleId].dependecies[relativePath])
                }
                var exports = {};
                (function(require,exports,code){
                    eval(code)
                })(localRequire,exports,graph[moduleId].code);
                return exports;
            }
            require('./src/index.js')
        })({"./src/index.js":{"dependecies":{"./write.js":"./src\\write.js"},"code":"\"use strict\";\n\nvar _write = require(\"./write.js\");\ndocument.write((0, _write.hell)());"},"./src\\write.js":{"dependecies":{"./randnum.js":"./src\\randnum.js","./conlog.js":"./src\\conlog.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hell = hell;\nvar _randnum = require(\"./randnum.js\");\nvar _conlog = require(\"./conlog.js\");\nfunction hell() {\n  (0, _conlog.print)((0, _randnum.randnum)(100, 1));\n  return 'hello webpack!';\n}"},"./src\\randnum.js":{"dependecies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.randnum = randnum;\nfunction randnum(max, min) {\n  return Math.floor(Math.random() * (max - min + 1) + min);\n}"},"./src\\conlog.js":{"dependecies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.print = print;\nfunction print(txt) {\n  console.log(txt);\n}"}})