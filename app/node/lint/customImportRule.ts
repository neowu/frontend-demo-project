import * as Lint from "tslint";
import * as ts from "typescript";

class ImportCheckWalker extends Lint.RuleWalker {
    private readonly internalOnlyImports = [
        /app\/component\/library\/(.+)/,
        /app\/module\/(.*?)\/component/,
    ];
    private readonly unnecessaryEndingIndexImport = /app\/(.*?)\/index$/;
    private readonly deepRelativeNestedImport = /^\.\.\/\.\.\/\.\./;

    protected visitImportDeclaration(node: ts.ImportDeclaration): void {
        const source = this.getImportSource(node.getText());
        if (this.internalOnlyImports.some(_ => _.test(source))) {
            this.addFailureAtNode(node, "import internal-only sources: " + source);
        } else if (this.unnecessaryEndingIndexImport.test(source)) {
            this.addFailureAtNode(node, "unnecessary ending index: " + source);
        } else if (this.deepRelativeNestedImport.test(source)) {
            this.addFailureAtNode(node, "deep nested import: " + source);
        }
    }

    private getImportSource(importDeclarationText: string): string {
        const sourceRegex = /from \"(.*?)\"/;
        const matched = sourceRegex.exec(importDeclarationText);
        return matched ? matched[1] : "";
    }
}

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ImportCheckWalker(sourceFile, this.getOptions()));
    }
}
