import { List } from "immutable"
import { Expr } from "../expr/Expr"
import { Op } from "../expr/Op"

export class UIExpr{
    readonly op: Op|null
    readonly children: List<UIExpr>
    private children_

    overridenContent: List<UIExpr>|string|null

    private onLeftClick: ()=>void
    private onRightClick: ()=>void

    hasParenthesis: boolean

    selected: "Selected"|"SubSelected"|"NotSelected"|null
    cursor: "CursorLeft"|"CursorRight"|"CursorNone"|null

    constructor(op: Op|null, children: List<UIExpr>){
        this.op = op
        this.children = children
        this.children_ = children.toArray()

        this.overridenContent = null

        this.onLeftClick = ()=>{}
        this.onRightClick = ()=>{}

        this.hasParenthesis = false

        this.selected = null
        this.cursor = null
    }

    addLeftClick(fn: ()=>void){
        let prev = this.onLeftClick

        this.onLeftClick = ()=>{
            fn()
            prev()
        }
    }

    addRightClick(fn: ()=>void){
        let prev = this.onRightClick

        this.onRightClick = ()=>{
            fn()
            prev()
        }
    }

    display(): JSX.Element{
        let result: JSX.Element

        if (typeof this.overridenContent == "string"){
            result = <>{this.overridenContent}</>
        }
        else if (this.overridenContent instanceof List) {
            result = <>{this.overridenContent.map(c=>c.display())}</>
        }
        else {
            result = <>{
                this.children.map((c,i)=>{
                    if (this.op?.childAmbigious(c.op!,i) ?? c.op?.generallyUnambigious!){
                        c.hasParenthesis = true
                    }
                    return c.display()
                })
            }</>
        }

        result = <span className={this.op?.cssName} onClick={()=>this.onLeftClick()} onContextMenu={()=>this.onRightClick()}>{result}</span>

        if (this.hasParenthesis){
            result = <span className="Wrapped">{result}</span>
        }
        if (this.cursor != null){
            result = <span className={this.cursor}>{result}</span>
        }
        if (this.selected != null){
            result = <span className={this.selected}>{result}</span>
        }

        result = <span>{result}</span>

        return result
    }
}
