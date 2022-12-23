import { int } from "../misc/Int"
import { PreJSX } from "../ui/PreJsx"
import { DisplayMod, Expr } from "./Expr"


/*
export function displayHelper(e: Expr, cssName: string, wrapRule: (e: Expr, i:int)=>boolean, displayMod: DisplayMod, groupRule: [int,int][]=[]): JSX.Element{
    return displayMod.wrap(
        group<JSX.Element>(
            e.children.map(
                (c,i)=>{
                    if (wrapRule(c,i)){
                        return <span>{c.display(wrap(displayMod.next(i, c)))}</span>
                    }
                    return <span>{c.display(displayMod.next(i, c))}</span>
                }
            ).toArray(),
            groupRule,
            (js,isLast)=>{
                if (isLast){
                    return <span className={cssName}>{js}</span>
                }
                return <span>{js}</span>
            }
        )
    )
}

function wrap(d: DisplayMod){
    return {
        wrap: (j: JSX.Element):JSX.Element=>{
            return d.wrap(<span className="Wrapped">{j}</span>)
        }, 
        next: (i: int, e: Expr):DisplayMod=>{
            return d.next(i,e)
        }
    }
}

function group<T>(l: T[], group: [int,int][], h: (_:T[], last:boolean)=>T){
    let stack: T[][] = [[]]

    l.forEach((c,i)=>{
        if (group.some(j=>j[0]==i)){
            stack.push([])
        }
        
        stack[stack.length-1].push(c)

        if (group.some(j=>j[1]==i)){
            let s = h(stack.pop()!, false)

            stack[stack.length-1].push(s)
        }
    })

    return h(stack[0], true)
}
*/


export function isConst(e: Expr, varr:string): boolean{
    if (typeof e == "number") return true

    if (typeof e == "string") return e != varr

    let Assign = require("./calculus/Assign").Assign
    let Limit = require("./calculus/Limit").Limit
    let Derive = require("./calculus/Derive").Derive
    let Integrate = require("./calculus/Integrate").Integrate

    if (e instanceof Assign || e instanceof Limit || e instanceof Derive || e instanceof Integrate) return false

    return !e.children.some(c=>!isConst(c, varr))
}





