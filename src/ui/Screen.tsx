import * as ReactDOM from 'react-dom/client';
import { KeyBoards as VirtualKeyBoard } from './Buttons';
import { MainState } from "./MainState";


export let Screen = new class{
    lastUpdated = 0

    history = [new MainState()]

    redos = []

    current = new MainState()

    buttons = new VirtualKeyBoard(c=>this.current.keyDown(c))

    private onUpdate(){
        if (this.current.lastUpdated > this.lastUpdated){
            this.lastUpdated = Date.now()

            this.history.push(this.current.clone(new Map()))
        }
    }

    display(){
        return <span className="Screen">
            <span className="Left">
                {this.buttons.display()}
                {this.current.displayMainExpr()}
                <span>
                    {this.undoButton()}
                    {this.zoomButton()}
                </span>
            </span>
            {this.current.displayFormulas()}
        </span>
    }

    private undoButton(){
        let onClick = ()=>{
            if (this.history.length==1) return

            this.history.pop()
    
            this.current = this.history[this.history.length-1].clone(new Map())
        }

        return <button className="undo" onClick={onClick}>
            {"⮌"}
        </button>
    }

    private zoomButton(){
        let onClick = ()=>{
            this.current.zoom()
        }

        return <button className="zoom" onClick={onClick}>
            {"🔍"}
        </button>
    }

    setToRoot(root: ReactDOM.Root){
        let render = ()=>{
            root.render(this.display())
        }

        document.addEventListener('keydown', (event)=>{
            this.current.keyDown(event.key)
            this.onUpdate()

            render()
        });

        document.addEventListener('click', (e)=>{
            this.onUpdate()

            render()
        })

        document.addEventListener('contextmenu', (e)=>{
            e.preventDefault()

            this.onUpdate()

            render()
        })

        render()
    }
}

