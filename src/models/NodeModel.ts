export class NodeModel {

    NodeName: string;
    Extension: string;
    NodeParent: string;
    LinkFile: string;
    PathUrl: string;
    isDocument: boolean;
    childrens: any[];
    
    constructor() {
        this.Extension = "";
        this.NodeName = "";
        this.LinkFile = "";
        this.NodeParent = "";
        this.PathUrl = "";
        this.isDocument = false;
        this.childrens = [];
    }

    public static createNode(jsonData: any[]): NodeModel[] {
        let tree: NodeModel[] = [];
        for (let i = 0; i < jsonData.length; i++) {
          let node: any = jsonData[i];
          this.addNode(node, tree);
        }
        return tree;
    }

    private static addNode(node: NodeModel, treeNodes: NodeModel[]) {
        let parentNode: NodeModel[] = this.getParentNode(node.NodeParent, treeNodes) || treeNodes;
        parentNode.push({
          NodeName: node.NodeName,
          NodeParent: node.NodeParent,
          childrens: [],
          LinkFile: node.LinkFile,
          isDocument: node.isDocument,
          Extension: node.Extension,
          PathUrl: node.PathUrl
        });
    }

    private static getParentNode(path: string, treeNodes: NodeModel[]): any[] {
        for (let i = 0; i < treeNodes.length; i++) {
          let treeNode = treeNodes[i];
      
          if (path === (treeNode.NodeParent + '\\' + treeNode.NodeName)) {
            return treeNode.childrens;
          } 
          else if (treeNode.childrens.length > 0) {
            let possibleParent = false;
      
            treeNode.childrens.forEach((item:NodeModel)=> {
              if (path.indexOf(item.NodeParent + '\\' + item.NodeName) == 0) {
                possibleParent = true;
                return false;
              }
            });
      
            if (possibleParent) {
              return this.getParentNode(path, treeNode.childrens)
            }
          }
        }
    }

}