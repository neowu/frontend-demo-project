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
var CodeStyleCheckWalker = /** @class */ (function (_super) {
    __extends(CodeStyleCheckWalker, _super);
    function CodeStyleCheckWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CodeStyleCheckWalker.prototype.visitMethodDeclaration = function (node) {
        this.checkLifecycleDecorator(node);
        this.checkMissingSagaIteratorReturnType(node);
    };
    CodeStyleCheckWalker.prototype.checkLifecycleDecorator = function (node) {
        var lifecycleMethods = ["onEnter", "onDestroy", "onTick", "onAppActive", "onAppInactive"];
        if (lifecycleMethods.includes(node.name.getText())) {
            var decorators = node.decorators;
            if (!decorators || decorators[0].getText() !== "@Lifecycle()") {
                this.addFailureAtNode(node, "missing @Lifecycle() decorator (also must be the first decorator)");
            }
        }
    };
    CodeStyleCheckWalker.prototype.checkMissingSagaIteratorReturnType = function (node) {
        if (node.asteriskToken) {
            // Generator method (supposed to be Module action)
            if (!node.type) {
                this.addFailureAtNode(node, "missing SagaIterator return type");
            }
        }
    };
    return CodeStyleCheckWalker;
}(Lint.RuleWalker));
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new CodeStyleCheckWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
