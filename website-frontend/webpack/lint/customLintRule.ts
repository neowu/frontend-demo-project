import * as Lint from "tslint";
import * as ts from "typescript";

function importSource(importDeclarationText: string): string {
    const sourceRegex = /from \"(.*?)\"/;
    const matched = sourceRegex.exec(importDeclarationText);
    return matched ? matched[1] : "";
}

function checkImport(node: ts.ImportDeclaration, context: Lint.WalkContext<void>): void {
    const internalOnlyImports = [
        /module\/(.*?)\/component/,
    ];
    const unnecessaryEndingIndexImport = /(.*?)\/index$/;
    const deepRelativeNestedImport = /^\.\.\/\.\.\/\.\./;

    const source = importSource(node.getText());
    if (internalOnlyImports.some(_ => _.test(source))) {
        context.addFailureAtNode(node, "import internal-only sources: " + source);
    } else if (unnecessaryEndingIndexImport.test(source)) {
        context.addFailureAtNode(node, "unnecessary ending index: " + source);
    } else if (deepRelativeNestedImport.test(source)) {
        context.addFailureAtNode(node, "deep nested import: " + source);
    }
}

function checkLifecycleDecorator(node: ts.MethodDeclaration, context: Lint.WalkContext<void>): void {
    const lifecycleMethods = ["onRegister", "onRender", "onDestroy", "onTick"];
    if (lifecycleMethods.includes(node.name.getText())) {
        const decorators = node.decorators;
        if (!decorators || decorators[0].getText() !== "@Lifecycle()") {
            context.addFailureAtNode(node, "missing @Lifecycle() decorator (also must be the first decorator)");
        }
    }
}

function checkMissingSagaIteratorReturnType(node: ts.MethodDeclaration, context: Lint.WalkContext<void>): void {
    if (node.asteriskToken) {
        // Generator method (supposed to be Module action)
        if (!node.type) {
            context.addFailureAtNode(node, "missing SagaIterator return type");
        }
    }
}

function walk(context: Lint.WalkContext<void>) {
    const callback = (node: ts.Node): void => {
        // Stop recursing further into the AST by returning early. Here, we ignore type nodes.
        if (node.kind >= ts.SyntaxKind.FirstTypeNode && node.kind <= ts.SyntaxKind.LastTypeNode) {
            return;
        }
        if (node.kind === ts.SyntaxKind.MethodDeclaration) {
            checkLifecycleDecorator(node as ts.MethodDeclaration, context);
            checkMissingSagaIteratorReturnType(node as ts.MethodDeclaration, context);
        } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            checkImport(node as ts.ImportDeclaration, context);
        } else {
            return ts.forEachChild(node, callback);
        }
    };

    return ts.forEachChild(context.sourceFile, callback);
}

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}
