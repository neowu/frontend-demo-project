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
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var ImportCheckWalker = /** @class */ (function (_super) {
    __extends(ImportCheckWalker, _super);
    function ImportCheckWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.internalOnlyImports = [
            /app\/component\/library\/(.+)/,
            /app\/module\/(.*?)\/component/,
        ];
        _this.unnecessaryEndingIndexImport = /app\/(.*?)\/index$/;
        _this.deepRelativeNestedImport = /^\.\.\/\.\.\/\.\./;
        return _this;
    }
    ImportCheckWalker.prototype.visitImportDeclaration = function (node) {
        var source = this.getImportSource(node.getText());
        if (this.internalOnlyImports.some(function (_) { return _.test(source); })) {
            this.addFailureAtNode(node, "import internal-only sources: " + source);
        }
        else if (this.unnecessaryEndingIndexImport.test(source)) {
            this.addFailureAtNode(node, "unnecessary ending index: " + source);
        }
        else if (this.deepRelativeNestedImport.test(source)) {
            this.addFailureAtNode(node, "deep nested import: " + source);
        }
    };
    ImportCheckWalker.prototype.getImportSource = function (importDeclarationText) {
        var sourceRegex = /from \"(.*?)\"/;
        var matched = sourceRegex.exec(importDeclarationText);
        return matched ? matched[1] : "";
    };
    return ImportCheckWalker;
}(Lint.RuleWalker));
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ImportCheckWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
