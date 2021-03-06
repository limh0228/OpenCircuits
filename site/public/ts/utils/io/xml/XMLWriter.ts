import {XMLNode} from "./XMLNode";

export class XMLWriter {
    private root: XMLDocument;
    private rootNode: XMLNode;

    public constructor(rootTag: string) {
        this.root = new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"UTF-8\"?><"+rootTag+"></"+rootTag+">", "text/xml");
        this.rootNode = new XMLNode(this.root, this.root.childNodes[0]);
    }

    public setVersion(version: number): void {
        const root = this.getRoot();
        root.addAttribute("version", version);
    }

    public setName(name: string): void {
        const root = this.getRoot();
        root.addAttribute("name", name);
    }

    public getRoot(): XMLNode {
        return this.rootNode;
    }

    public serialize(): string {
        return new XMLSerializer().serializeToString(this.root.documentElement);
    }

}
