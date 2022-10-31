import { List } from "immutable";
import { char } from "../misc/Char";
import { Class } from "../misc/Class";
import { cloneHelper, CloneMap } from "../misc/Clone";
import { int } from "../misc/Int";
import { Path } from "../misc/Path";


export interface Expr{
    type: null|"boolean"|"number"
    generallyUnambigious: boolean
    children: List<Expr>

    get(index: int):Expr
    set(index: int, e:Expr):this
    map(fn: (e: Expr, i: int)=>Expr): this

    getFromPath(path: Path): Expr
    setFromPath(path: Path, replacement: Expr): Expr
    sameOp(other: Expr): boolean
    clone(cloneMap: CloneMap): this
    parse(): Expr

    display(d: DisplayMod): JSX.Element
}

export type DisplayMod = {
    wrap: (jsx: JSX.Element)=>JSX.Element, 
    next: (i: int, e: Expr) => DisplayMod
}

export const NullDisplayMod = {
    wrap: (jsx: JSX.Element): JSX.Element=>{
        return jsx
    }, 
    next: (i: int, e: Expr):DisplayMod=>{
        return NullDisplayMod
    }
}

declare global{
    interface String extends Expr{
     
    }
    interface Number extends Expr{
        
    }
    interface Boolean extends Expr{
        
    }
}

String.prototype.type = null
String.prototype.generallyUnambigious = true
String.prototype.children = List()
String.prototype.get = function():Expr{
    throw Error()
}
String.prototype.set = function():String{
    throw Error()
}
String.prototype.map = function():String{
    return this
}
String.prototype.getFromPath = function(p: Path): Expr{
    if (p == Path.EMPTY) return this

    throw Error()
}
String.prototype.setFromPath = function(p: Path, e: Expr){
    if (p == Path.EMPTY) return e

    throw Error()
}
String.prototype.sameOp = function(other:Expr):boolean{
    return this===other
}
String.prototype.clone = function():String{
    return this
}
String.prototype.parse = function():Expr{
    return this
}
String.prototype.display = function(d: DisplayMod):JSX.Element{
    return d.wrap(<span>{this}</span>)
}

Number.prototype.type = "number"
Number.prototype.generallyUnambigious = true
Number.prototype.children = List()
Number.prototype.get = function():Expr{
    throw Error()
}
Number.prototype.set = function():Number{
    throw Error()
}
Number.prototype.map = function():Number{
    return this
}
Number.prototype.getFromPath = function(p: Path): Expr{
    if (p == Path.EMPTY) return this

    throw Error()
}
Number.prototype.setFromPath = function(p: Path, e: Expr){
    if (p == Path.EMPTY) return e

    throw Error()
}
Number.prototype.sameOp = function(other:Expr):boolean{
    return this===other
}
Number.prototype.clone = function():Number{
    return this
}
Number.prototype.parse = function():Expr{
    return this
}
Number.prototype.display = function(d: DisplayMod):JSX.Element{
    return d.wrap(<span>{this as number}</span>)
}

Boolean.prototype.type = "boolean"
Boolean.prototype.generallyUnambigious = true
Boolean.prototype.children = List()
Boolean.prototype.get = function():Expr{
    throw Error()
}
Boolean.prototype.set = function():Boolean{
    throw Error()
}
Boolean.prototype.map = function():Boolean{
    return this
}
Boolean.prototype.getFromPath = function(p: Path): Expr{
    if (p == Path.EMPTY) return this

    throw Error()
}
Boolean.prototype.setFromPath = function(p: Path, e: Expr){
    if (p == Path.EMPTY) return e

    throw Error()
}
Boolean.prototype.sameOp = function(other:Expr):boolean{
    return this===other
}
Boolean.prototype.clone = function():Boolean{
    return this
}
Boolean.prototype.parse = function():Expr{
    return this
}
Boolean.prototype.display = function(d: DisplayMod):JSX.Element{
    return d.wrap(<span>{this ? "true" : "false"}</span>)
}



