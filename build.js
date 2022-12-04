const Compiler = require("./packages/Compiler");
const option = require("./webpack.config");
new Compiler(option).run();