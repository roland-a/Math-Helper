import { List, Map } from "immutable"
import { char } from "../misc/Char"
import { Class } from "../misc/Class"
import { cloneHelper, CloneMap } from "../misc/Clone"
import { int } from "../misc/Int"
import { UIExpr } from "../ui/UiExpr"
import { Add } from "./basic/Add"
import { Mult } from "./basic/Mult"
import { Neg } from "./basic/Neg"
import { Sub } from "./basic/Sub"
import { And } from "./boolean/And"
import { Eq } from "./boolean/Eq"
import { Or } from "./boolean/Or"
import { E } from "./calculus/E"
import { Infinity } from "./calculus/Infinity"
import { Cos } from "./trigonometry/Cos"
import { Pi } from "./trigonometry/Pi"
import { Sin } from "./trigonometry/Sin"
import { Op } from "./Op"
import { Expr } from "./Expr"
import { Num } from "./basic/Num"
import { Var } from "./calculus/Var"
import { PrettyExpr, unprettify } from "./helper"
import { stringify } from "flatted"


export class TypeBox extends Op{
    cssName = "TypeBox"

    contents: (char|Expr)[] = []

    readonly type = null
    readonly generallyUnambigious = true

    insert(cursorPos:int, e:Expr|char): [TypeBox,int]{
        if (typeof e == "number") throw "numbers not allowed"
        if (typeof e == "string" && e.length != 1) throw "inserted strings must only be single characters"

        if (e instanceof Expr && e.op == this) throw "self reference not allowed"

        if (e instanceof Expr && e.op instanceof TypeBox){
            this.contents.splice(cursorPos, 0, e)

            return [e.op,0]
        }
  
        //tries to move content behind inside typebox
        if (e instanceof Expr && e.children.find(c=>c instanceof TypeBox) !== undefined){
            let moveStart = cursorPos
            while (true){
                if (moveStart == 0) break

                let behind = this.contents[moveStart-1]

                if (typeof behind != "string") break
                if (/[+\-*=∧∨]/.test(behind)) break
    
                moveStart -= 1
            }
    
            let movedContent = this.contents.splice(moveStart, cursorPos-moveStart, e)
    
            //typebox that will contain the moved contnent
            let boxWithMovedContent = e.children.find(c=>c.op instanceof TypeBox)!.op as TypeBox

            //typebox that the cursor will be on
            let boxWithCursor = e.children.find(c=>c.op instanceof TypeBox && c.op != boxWithMovedContent)!.op as TypeBox ?? boxWithMovedContent
            
            boxWithMovedContent.contents = movedContent
    
            return [boxWithCursor, 0]
        }
        this.contents.splice(cursorPos, 0, e)

        return [this, cursorPos+1]
    }

    remove(cursorPos:int): boolean{
        if (cursorPos == 0) return false

        if (this.contents.length == 0) return false

        this.contents.splice(cursorPos-1, 1)

        return true
    }

    modifyUi(self: UIExpr): void {
        console.log(
            this
        )

        self.overridenContent = List(
            this.contents.map(
                c=>{
                    if (typeof c == "string"){
                        let result = new UIExpr(null, List())

                        result.overridenContent = c

                        return result
                    }
                    return c.toUiExpr()
                }
            )
        )
    }

    parse(): Expr{
        return parse(this.contents)
    }

    clone(cloneMap: CloneMap): this{
        return cloneHelper(
            this,
            cloneMap,
            ()=> new TypeBox() as this,
            c => {
                c.contents = this.contents.map(c=>{
                    if (c instanceof Expr){
                        return c.clone(cloneMap)
                    }
                    return c
                })
            }
        )
    }
}

function parse(content: (char|Expr)[]): Expr{
    if (content.length == 0) throw "zero"

    if (content.length == 1 && typeof content[0] == "object"){
        return parseExpr(content[0])
    }

    let result = (
        parseOp(content, Or, "∨") ??
        parseOp(content, And, "∧") ??
        parseOp(content, Eq, "=") ??
        parseOp(content, Add, "+") ??
        parseLeft(content, Sin, "sin") ??
        parseLeft(content, Cos, "cos") ??
        parseOp(content, Mult, "*") ??
        parseOp(content, Sub, "-", 2) ??
        parseNum(content) ??
        parseImplicitMult(content) ??
        parseLeft(content, Neg, "-") ??
        parseSymbol(content, "true", true) ??
        parseSymbol(content, "false", false) ??
        parseSymbol(content, "e", E) ??
        parseSymbol(content, "pi", Pi) ??
        parseSymbol(content, "inf", Infinity) ??
        parseVar(content) ??
        null
    )

    if (result != null) return result

    alert("cant parse " + content.join(""))

    throw ""
}

export function parseExpr(e: Expr): Expr{
    if (e.op instanceof TypeBox){
        return parse(e.op.contents)
    }

    return e.map(c=>parseExpr(c))
}

function parseSymbol(content: (char|Expr)[], symbol: string, e: PrettyExpr): Expr|null{
    e = unprettify(e)

    if (content.some(c => typeof c != "string")) return null

    if (content.join("") != symbol) return null

    return e
}

function parseImplicitMult(content: (char|Expr)[]): Expr|null{
    if (content.some(c=> typeof c != "string")) return null

    let content_ = content as char[]

    if (!/^-?[0-9]+\.?[0-9]*[a-zA-Z]+$/.test(content.join(""))) return null;

    let varStart = content_.findIndex(c=>/[a-zA-Z]/.test(c))

    let num = content_.slice(0, varStart)
    let varr = content_.slice(varStart, content.length)

    return Mult.toExpr(
        parseNum(num)!,
        parseVar(varr)!
    )
}

function parseOp(content: (char|Expr)[], op: Op, delimiter:char, max:int=1024): Expr|null{
    let result: (char|Expr)[][] = [[]]

    content.forEach((c)=>{
        if (c == delimiter && result.length != max){
            result.push([])
            return
        }
        result[result.length-1].push(c)
    })

    if (result.some(c=>c.length==0)) return null

    //nothing got parsed
    if (result.length==1) return null

    return op.toExpr(...result.map(c=>parse(c)))
}

function parseLeft(content: (char|Expr)[], op: Op, delimiter:string){
    if (content.length <= delimiter.length) return null

    for (let i = 0; i < content.length; i++){
        if (content[i] != [...delimiter][i]) return null
    }

    return op.toExpr(parse(content.slice(delimiter.length)))
}

function parseNum(content: (char|Expr)[]): Expr|null{
    if (content.some(c=>typeof c != "string")) return null

    let str = content.join("")

    if (!/^-?[0-9]+\.?[0-9]*$/.test(str)) return null

    let n = Number.parseFloat(str)

    if (!Number.isFinite(n)) return null

    return new Num(n).toExpr()
}

function parseVar(content: (char|Expr)[]): Expr|null{
    if (content.some((c)=>typeof c != "string")) return null

    let n = content.join("")

    if (!/^[a-zA-Z][_a-zA-Z0-9]*$/.test(n)) return null

    return new Var(n).toExpr()
}