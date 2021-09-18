import * as React from 'react';

import { NodeModel } from '../../models';

import { Services } from '../../services/Services';

//jsonData
import jsonData from '../../data/jsonData.json';



//Interfaces
interface IAppState {
    nodes: NodeModel[];
    loading: boolean;
}

interface IFolderState {
    node: NodeModel;
    cssButtonFolder: string;
}

interface INodeProps {
    node: NodeModel;
    showDoc?:(linkFile: string)=>void;
    updateCSSClass?:(e: any)=>void;
}

interface IFolderContainerProps {
    nodes: NodeModel[];
}

interface IFolderContainerState {
    linkFile: string;
    openModal: boolean;
}

interface IModalProps {
    closeDialog:()=>void
    open: boolean;
    linkFile: string;
}

interface ISpinnerProps {
    loading: boolean;
}

export class App extends React.Component<any,IAppState> {

    jsonData: any = jsonData;

    constructor(props: any){
        super(props);
        this.state = {
            nodes:[],
            loading: false
        }
    }


    private _getDocuments(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.value != "") {
            this.setState({loading: true})

            setTimeout(  () => { 
                this.setState({
                    nodes: NodeModel.createNode(this.jsonData),
                    loading: false
                });
            },  2 * 1000);

            // Services.getDocuments(e.target.value).then((jsonData: any[])=>{
            //     this.setState({
            //         nodes: NodeModel.createNode(jsonData),
            //         loading:false
            //     });
            // }).catch((err:any)=>{
            //     console.log(err);
            //     this.setState({
            //         nodes: [],
            //         loading:false
            //     });
            // });
        }
        else{
            this.setState({
                nodes: [],
                loading: false
            });
        }

    }

    render() {
        return (
            <div>
                <div className="topSearcher">
                    <p>Copiar esta url: http://webserverapi.azurewebsites.net/service.svc/GetAllFiles</p>
                    <input type="text" name="urlRoot" placeholder="url document folder" onChange = { (e) => this._getDocuments(e) } />
                </div>
                {this.state.nodes.length > 0 ?
                <div className="folderView">
                    <h3 className="heading">{ this.state.nodes.length > 0 ?  this.state.nodes[0].NodeParent.split('\\')[1] : "" }</h3>
                    <div className="file-browser">
                        <FolderContainer nodes = { this.state.nodes } /> 
                    </div>
                </div>
                :
                <Spinner loading = { this.state.loading } />
                }
            </div>
        );
    }
}

class FolderContainer extends React.Component<IFolderContainerProps,IFolderContainerState> {

    constructor(props:IFolderContainerProps) {
        super(props);
        this.state = {
            linkFile: "",
            openModal: false
        }
        this.showDoc = this.showDoc.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.updateCSSClass = this.updateCSSClass.bind(this);
    }

    private updateCSSClass(e: any) {
        e.stopPropagation();
        if(e.target.className != "dialog-btn" && e.target.className != "") {
            if(e.target.className == "folder") {
                e.target.className = "folder folder-open"
            }
            else{
                e.target.className = "folder"
            }
        }
    }

    private showDoc(linkFile: string) {
        this.setState({
            linkFile: linkFile,
            openModal: true
        })
    }

    private closeDialog() {
        this.setState({
            linkFile: "",
            openModal: false
        })
    }

    render() {
        if(this.props.nodes.length > 0 && this.props.nodes[0].NodeParent == null) {
            this.props.nodes.shift();
        }
        const items = this.props.nodes;
        let folderItems:JSX.Element[] = [];
        let index=0;
        for (let i = 0; i < items.length; i++) {
            if (!items[i].isDocument) {
                folderItems.push(<Folder key={index++} updateCSSClass= {this.updateCSSClass} node={items[i]}/>);
            } else {
                folderItems.push(<File key={index++} showDoc = {this.showDoc} node={items[i]}/>);
            }
        }
        return (
            <ul>
                {folderItems}
                <Modal  open = { this.state.openModal } 
                        closeDialog = {()=>this.closeDialog()}  
                        linkFile = {this.state.linkFile}/>
            </ul>
        );
    }
}


class Folder extends React.Component<INodeProps,IFolderState> {

    constructor(props: INodeProps) {
        super(props)
        this.state = {
            node: this.props.node,
            cssButtonFolder: "folder"
        }
    }

    render() {
        return (
            <li className={ this.state.cssButtonFolder } onClick = { (e) => this.props.updateCSSClass(e) }>
                { this.props.node.NodeName }
                <FolderContainer nodes = { this.props.node.childrens } /> 
            </li>
        )
    }
}

class File extends React.Component<INodeProps,{}> {

    render() {
        return (
            <li className='file'>
                <button onClick = {()=>this.props.showDoc(this.props.node.LinkFile)}>{ this.props.node.NodeName }</button>
            </li>
        )
    }
}


class Modal extends React.Component<IModalProps,any> {

    constructor(props: IModalProps) {
        super(props)
    }

    render(){
        return(
            <dialog open = { this.props.open }>
                <button className = "dialog-btn" onClick={ ()=>this.props.closeDialog() }>X</button>
                <iframe className="google-docs iframe" 
                        src={ this.props.linkFile != "" ? "https://docs.google.com/viewer?url="+this.props.linkFile.replace(/\\/g, "/").replace(/http:/g, "http:/")+"&embedded=true":""}
                        height={500}
                        width={600} />
            </dialog>
        )
    }
}

class Spinner extends React.Component<ISpinnerProps,any> {

    constructor(props: ISpinnerProps) {
        super(props)
    }

    render(){
        return(
            <div>
                {this.props.loading == true ?
                <div className="vertical-loading-bars folderView">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                :
                null
                }
            </div>
        )
    }
}