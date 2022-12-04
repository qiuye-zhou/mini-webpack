// 引入内置模块
const fs = require("fs");
const path = require("path");

// 引入解析模块
const Parser = require("./Parser");

class Compiler {
    constructor (options) {
        this.entry = options.entry; // 实例属性 entry 存储用户配置的 entry 信息
        this.output = options.output; // 存储用户配置的 output 信息
        this.modules = []; // 存储模块
    }

    // 构建启动
    run () {
        // 调用实例方法 build 将人口路径传递过去
        const info = this.build(this.entry);
        // 此对象作为一个模块存储到 modules 数组中
        this.modules.push(info);
        // 找到所有的依赖
        for (let i = 0; i < this.modules.length; i++) {
            const obj = this.modules[i];
            // 查看当前模块是否还有依赖不 this.modules 里面
            if(obj.dependecies && this.modules.indexOf(obj.filename) === -1) {
                for (const depend in obj.dependecies) {
                    // 将得到的信息模块添加入modules
                    this.modules.push(this.build(obj.dependecies[depend]));
                }
            }
        }

        // 此时 modules 数组里面存放了所有依赖模块的信息对象
        // 接下来生成依赖关系图
        const dependecyGraph = this.modules.reduce(
            (graph, item) => ({
                ...graph,
                [item.filename]: {
                    dependecies: item.dependecies,
                    code: item.code
                }
            }),
            {}
        );

        // 所生成的 dependencyGraph 实际上就是一个对象
        // 对象的键名为模块路径，对象值为 dependecies 和 code 组成的对象
        // 接下来生成代码
        this.generate(dependecyGraph);
    }

    // 构建
    build (filename) {
        const { getAst, getDependecies, getCode } = Parser;
        const ast = getAst(filename);
        const dependecies = getDependecies(ast, filename);
        const code = getCode(ast);

        // 返回解析过后的对象，里面包含文件路径、依赖、代码
        return {
            filename,
            dependecies,
            code
        }
    }

    // 生成最终打包后的代码
    generate (code) {
        // 生成用户配置的打包文件存放路径
        const filepath = path.join(this.output.path, this.output.filename)
        // 生成 bundle
        const bundle = `(function(graph) {
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
            require('${this.entry}')
        })(${JSON.stringify(code)})`;
        const dir = filepath.slice(0,filepath.lastIndexOf("\\"))
        // 判断生成目录是否存在
        if (!fs.existsSync(dir)) {
            // 不存在则创建
            fs.mkdirSync(dir)
        }
        // 最后将生成的 bundle 写入文件
        try {
            fs.writeFileSync(filepath, bundle);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Compiler;