import { List, Map } from "immutable"
import { char } from "../misc/Char"
import { Class } from "../misc/Class"
import { cloneHelper, CloneMap } from "../misc/Clone"
import { int } from "../misc/Int"
import { PreJSX } from "../ui/PreJsx"
import { Add } from "./basic/Add"
import { Mult } from "./basic/Mult"
import { Neg } from "./basic/Neg"
import { Sub } from "./basic/Sub"
import { And } from "./boolean/And"
import { Eq } from "./boolean/Eq"
import { Or } from "./boolean/Or"
import { E } from "./calculus/E"
import { Infinity } from "./calculus/Infinity"
import { DisplayMod, Expr } from "./Expr"
import { ExprBase } from "./ExprBase"
import { Cos } from "./trigonometry/Cos"
import { Pi } from "./trigonometry/Pi"
import { Sin } from "./trigonometry/Sin"

export class TypeBox extends ExprBase{
    contents: (char|Expr)[] = []

    readonly type = null
    readonly generallyUnambigious = true

    constructor(){
         super([])
    }

    insert(cursorPos:int, e:Expr): [TypeBox,int]{
        if (typeof e == "number") throw "numbers not allowed"
        if (typeof e == "string" && e.length != 1) throw "inserted strings must only be single characters"

        if (e instanceof TypeBox){
            this.contents.splice(cursorPos, 0, e)

            return [e,0]
        }
        //tries to move content behind inside typebox
        if (e.children.find(c=>c instanceof TypeBox) !== undefined){
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
            let boxWithMovedContent = e.children.find(c=>c instanceof TypeBox) as TypeBox

            //typebox that the cursor will be on
            let boxWithCursor = e.children.find(c=>c instanceof TypeBox && c != boxWithMovedContent) as TypeBox ?? boxWithMovedContent
            
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

    toPreJSX(): PreJSX {
        return new PreJSX(
            this,
            "TypeBox",
            this.contents.map(
                c=>{
                    if (typeof c != "string"){
                        return c.toPreJSX()
                    }
                    return new PreJSX(null, "", c)
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
                c.contents = this.contents.map(c=>c.clone(cloneMap))
            }
        )
    }
}

function parse(content: (char|Expr)[]): Expr{
    if (content.length == 0) throw "zero"

    if (content.length == 1 && typeof content[0] == "object"){
        return content[0].parse()
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

function parseSymbol(content: (char|Expr)[], symbol: string, e: Expr): Expr|null{
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

    return new Mult(
        parseNum(num)!,
        parseVar(varr)!
    )
}

function parseOp(content: (char|Expr)[], clazz: Class<Expr>, delimiter:char, max:int=1024): Expr|null{
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

    return new clazz(...result.map(c=>parse(c)))
}

function parseLeft(content: (char|Expr)[], op: Class<Expr>, delimiter:string){
    if (content.length <= delimiter.length) return null

    for (let i = 0; i < content.length; i++){
        if (content[i] != [...delimiter][i]) return null
    }

    return new op(parse(content.slice(delimiter.length)))
}

function parseNum(content: (char|Expr)[]): Expr|null{
    if (content.some(c=>typeof c != "string")) return null

    let str = content.join("")

    if (!/^-?[0-9]+\.?[0-9]*$/.test(str)) return null

    let n = Number.parseFloat(str)

    if (!Number.isFinite(n)) return null

    return n
}

function parseVar(content: (char|Expr)[]): Expr|null{
    if (content.some((c)=>typeof c != "string")) return null

    let n = content.join("")

    if (!/^[a-zA-Z][_a-zA-Z0-9]*$/.test(n)) return null

    return n
}