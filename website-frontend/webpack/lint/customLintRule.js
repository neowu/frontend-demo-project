"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var ts = require("typescript");
function importSource(importDeclarationText) {
    var sourceRegex = /from \"(.*?)\"/;
    var matched = sourceRegex.exec(importDeclarationText);
    return matched ? matched[1] : "";
}
function checkImport(node, context) {
    var internalOnlyImports = [
        /module\/(.*?)\/component/,
    ];
    var unnecessaryEndingIndexImport = /(.*?)\/index$/;
    var deepRelativeNestedImport = /^\.\.\/\.\.\/\.\./;
    var source = importSource(node.getText());
    if (internalOnlyImports.some(function (_) { return _.test(source); })) {
        context.addFailureAtNode(node, "import internal-only sources: " + source);
    }
    else if (unnecessaryEndingIndexImport.test(source)) {
        context.addFailureAtNode(node, "unnecessary ending index: " + source);
    }
    else if (deepRelativeNestedImport.test(source)) {
        context.addFailureAtNode(node, "deep nested import: " + source);
    }
}
function checkLifecycleDecorator(node, context) {
    var lifecycleMethods = ["onRegister", "onRender", "onDestroy", "onTick"];
    if (lifecycleMethods.includes(node.name.getText())) {
        var decorators = node.decorators;
        if (!decorators || decorators[0].getText() !== "@Lifecycle()") {
            context.addFailureAtNode(node, "missing @Lifecycle() decorator (also must be the first decorator)");
        }
    }
}
function checkMissingSagaIteratorReturnType(node, context) {
    if (node.asteriskToken) {
        // Generator method (supposed to be Module action)
        if (!node.type) {
            context.addFailureAtNode(node, "missing SagaIterator return type");
        }
    }
}
function walk(context) {
    var callback = function (node) {
        // Stop recursing further into the AST by returning early. Here, we ignore type nodes.
        if (node.kind >= ts.SyntaxKind.FirstTypeNode && node.kind <= ts.SyntaxKind.LastTypeNode) {
            return;
        }
        if (node.kind === ts.SyntaxKind.MethodDeclaration) {
            checkLifecycleDecorator(node, context);
            checkMissingSagaIteratorReturnType(node, context);
        }
        else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            checkImport(node, context);
        }
        else {
            return ts.forEachChild(node, callback);
        }
    };
    return ts.forEachChild(context.sourceFile, callback);
}
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
