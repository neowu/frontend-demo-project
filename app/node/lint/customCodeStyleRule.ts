import * as Lint from "tslint";
import * as ts from "typescript";

class CodeStyleCheckWalker extends Lint.RuleWalker {
    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.checkLifecycleDecorator(node);
        this.checkMissingSagaIteratorReturnType(node);
    }

    private checkLifecycleDecorator(node: ts.MethodDeclaration): void {
        const lifecycleMethods = ["onEnter", "onDestroy", "onTick", "onAppActive", "onAppInactive"];
        if (lifecycleMethods.includes(node.name.getText())) {
            const decorators = node.decorators;
            if (!decorators || decorators[0].getText() !== "@Lifecycle()") {
                this.addFailureAtNode(node, "missing @Lifecycle() decorator (also must be the first decorator)");
            }
        }
    }

    private checkMissingSagaIteratorReturnType(node: ts.MethodDeclaration): void {
        if (node.asteriskToken) {
            // Generator method (supposed to be Module action)
            if (!node.type) {
                this.addFailureAtNode(node, "missing SagaIterator return type");
            }
        }
    }
}

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new CodeStyleCheckWalker(sourceFile, this.getOptions()));
    }
}
