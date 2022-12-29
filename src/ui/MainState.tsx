import { int } from "../misc/Int";
import { Side } from "../misc/Side";
import { Expr as Expr } from "../expr/Expr";
import { char } from "../misc/Char";
import { List, Set } from "immutable";
import { parseExpr, TypeBox } from "../expr/TypeBox";
import { Path } from "../misc/Path";
import { Div } from "../expr/basic/Div";
import { Abs } from "../expr/basic/Abs";
import { Pow } from "../expr/basic/Pow";
import { get } from "../expr/Equivs";
import { Limit } from "../expr/calculus/Limit";
import { Derive } from "../expr/calculus/Derive";
import { Assign } from "../expr/calculus/Assign";
import { Integrate } from "../expr/calculus/Integrate";
import { CloneMap } from "../misc/Clone";
import { UIExpr } from "./UiExpr";
import { Op } from "../expr/Op";

export class MainState {
    private main: Expr = new TypeBox().toExpr()

    private typeBox: TypeBox | null = this.main.op as TypeBox
    private typeBoxPos: int = 0

    private zoomPath: Path = Path.EMPTY

    private selectedExpr: Path | null = null
    private subSelectedExpr: Set<int> = Set()

    private formulas: Expr[] = []

    private selectedFormula: int | null = null

    lastUpdated = 0;

    displayMainExpr(): JSX.Element {
        return this.main
            .getFromPath(this.zoomPath)
            .display(
                r=>this.manipMainExpr(r, this.zoomPath)
            )
    }

    private manipMainExpr(d: UIExpr, p: Path) {
        if (d.op instanceof TypeBox){
            this.manipTypebox(d)
            return
        }

        d.addLeftClick(
            () => {
                if (Date.now() - this.lastUpdated < 10) return
                this.lastUpdated = Date.now()
    
                if (this.selectedExpr == p) return
    
                this.selectedExpr = p;
                this.subSelectedExpr = Set();
    
                this.updateFormulas();
    
                let m = this.main.getFromPath(this.selectedExpr)
            }
        )

        d.addRightClick(
            () => {
                if (Date.now() - this.lastUpdated < 10) return
                this.lastUpdated = Date.now()
                    
                if (p == Path.EMPTY)
                    return false;
    
                if (this.selectedExpr != p.pop())
                    return false;
    
                if (this.subSelectedExpr.has(p.last())) {
                    this.subSelectedExpr = this.subSelectedExpr.remove(p.last());
                }
                else {
                    this.subSelectedExpr = this.subSelectedExpr.add(p.last());
                }
    
                this.updateFormulas();
    
                this.lastUpdated = Date.now();
            }
        )

        d.children.forEach((c,i)=>{
            if (typeof c == "string") return

            this.manipMainExpr(c, p.add(i))
        })

        if (this.selectedExpr == p) {
            d.selected = ("Selected")
        }
        else if (p != Path.EMPTY && p.pop() == this.selectedExpr && this.subSelectedExpr.has(p.last())) {
            d.selected = ("SubSelected")
        }
        else {
            d.selected = ("NotSelected")
        }
    }

    displayFormulas(): JSX.Element {
        let l = this.formulas.map((c, i) => {
            let result: UIExpr = c.toUiExpr()

            if (i == this.selectedFormula) {
                result.selected = ("Selected")
            }
            else {
                result.selected = ("NotSelected")
            }

            result.addLeftClick(
                () => {                
                    this.selectedFormula = i;
                }    
            )

            this.manipExprInFormula(result)

            return result.display()
        });

        return (
            <span className="Formulas">
                {l}
            </span>
        );
    }

    private manipExprInFormula(d: UIExpr) {
        if (d.op instanceof TypeBox){
            this.manipTypebox(d)
            return
        }

        d.children.forEach(c=>{
            if (typeof c == "string") return

            this.manipExprInFormula(c)
        })
    }

    private manipTypebox(d: UIExpr) {
        let t = d.op as TypeBox

        d.addLeftClick(
            ()=>{
                if (Date.now() - this.lastUpdated < 10) return
                this.lastUpdated = Date.now()
    
                this.typeBox = t
                this.typeBoxPos = t.contents.length
            }
        )

        if (t == this.typeBox){ 
            d.selected = "Selected"

            if (this.typeBoxPos == 0){
                d.cursor = "CursorLeft"
            }
            else {
                d.cursor = "CursorNone"
            }
        }
        else {
            d.selected = "NotSelected"
        }

        (d.overridenContent as List<UIExpr>).forEach((c,i)=>this.typeBoxContentManip(t, c, i))
    }

    private typeBoxContentManip(parent: TypeBox, d: UIExpr, i: int){
        d.addLeftClick(
            ()=>{
                if (Date.now() - this.lastUpdated < 10) return
                this.lastUpdated = Date.now()
    
                this.typeBox = parent
                this.typeBoxPos = i+1
            }
        )
        

        if (d.op instanceof TypeBox){
            this.manipTypebox(d)
        }
        else {
            this.manipExprInFormula(d)
        }

        if (parent == this.typeBox && i == this.typeBoxPos-1){
            d.cursor = "CursorRight"
        }
        else {
            d.cursor = "CursorNone"
        }
    }

    private updateFormulas(): void {
        if (this.selectedExpr == null) return

        this.formulas = get(this.main.getFromPath(this.selectedExpr), this.subSelectedExpr);
        this.selectedFormula = null;
    }

    keyDown(key: char|Expr): void {
        if (!(typeof key == "string")){
            this.insert(key)
            return
        }

        if (key == "Enter") {
            this.enter()
            return;
        }

        switch (key) {
            case "ArrowLeft": this.next(Side.LEFT); break;
            case "ArrowRight": this.next(Side.RIGHT); break;
            case "Backspace": this.delete(); break;
            case "/": this.insert(Div.toExpr(new TypeBox(), new TypeBox())); break;
            case "^": this.insert(Pow.toExpr(new TypeBox(), new TypeBox())); break;
            case "|": this.insert(Abs.toExpr(new TypeBox())); break;
            case "'": this.insert(Derive.toExpr(new TypeBox(), new TypeBox())); break;
            case "(": this.insert(new TypeBox().toExpr()); break;
            default: if (key.length == 1) {
                this.insert(key);
            }
        }
    }

    private insert(c: char|Expr) {
        if (this.typeBox == null) return

        [this.typeBox, this.typeBoxPos] = this.typeBox.insert(this.typeBoxPos, c)

        this.lastUpdated = Date.now();
    }

    private delete() {
        if (this.typeBox == null) return

        let removed = this.typeBox.remove(this.typeBoxPos)
        if (removed) this.typeBoxPos -= 1;

        this.lastUpdated = Date.now();
    }

    zoom(){
        if (this.zoomPath != this.selectedExpr && this.selectedExpr != null){
            this.zoomPath = this.selectedExpr
        }
        else {
            this.zoomPath = Path.EMPTY
        }
        this.lastUpdated = Date.now()
    }

    private next(side: Side) {
  
        if (this.typeBox == null) return

        let nextItems = this.makeNextItemsList(side)

        if (nextItems.length == 0) return

        while (!(nextItems[0].parent.op instanceof TypeBox)){
            rotate(nextItems)
        }

        this.typeBox = nextItems[0].parent.op
        this.typeBoxPos = nextItems[0].i

        this.lastUpdated = Date.now()
    }

    private makeNextItemsList(side: Side): {i:int, parent:Expr}[]{
        let result: {i:int, parent:Expr}[] = []

        let getChildFn = (e:Expr|char)=>{
            if (typeof e == "string"){
                return []
            }
            if (e.op instanceof TypeBox){
                return [...e.op.contents, ""]
            }
            return e.children.toArray()
        }

        let possibleRoots = [this.main, ...this.formulas]

        if (this.typeBox == null) return []

        let root = possibleRoots.find(c=>contains(c, this.typeBox?.toExpr()!, getChildFn))

        if (root === undefined) return []
        
        forEachChild<Expr|char>(root, getChildFn, (c,i,p)=>result.push({i:i, parent:p as Expr}))

        if (side == Side.LEFT){
            result.reverse()
        }

        //rotates the list until parent is the current typebox and position
        while (true){
            if (result[0].parent.op == this.typeBox && result[0].i == this.typeBoxPos){
                //rotates it one last time
                rotate(result)
                break
            }
            else {
                rotate(result)
            }
        }
        return result
    }

    private enter() {
        if (this.main.op instanceof TypeBox) {
            this.main = parseExpr(this.main);
            this.updateFormulas();

            this.lastUpdated = Date.now();
        }
        else if (this.selectedFormula != null && this.selectedExpr != null) {
            alert()

            this.main = this.main.setFromPath(
                this.selectedExpr, 
                parseExpr(this.formulas[this.selectedFormula])
            );

            this.selectedExpr = null;
            this.formulas = []

            this.lastUpdated = Date.now();
        }
    }

    clone(cloneMap: CloneMap): MainState {
        let result = new MainState();

        result.main = this.main.clone(cloneMap);

        result.typeBox = this.typeBox?.clone(cloneMap) ?? null;
        result.typeBoxPos = this.typeBoxPos;

        result.selectedExpr = this.selectedExpr;
        result.subSelectedExpr = this.subSelectedExpr;

        result.formulas = this.formulas.map(c => c.clone(cloneMap));
        result.selectedFormula = this.selectedFormula;

        result.lastUpdated = this.lastUpdated;

        return result;
    }
}


function contains<T>(root: T, t: T, childrenFn: (root:T)=>T[]): boolean{
    if (root == t) return true

    return childrenFn(root).find(c=>contains(c,t,childrenFn)) !== undefined
}


function forEachChild<T>(root: T, childrenFn: (root:T)=>T[], forEachChildFn: (child: T, index:int, parent:T)=>void){
    childrenFn(root).forEach((c,i)=>{
        forEachChildFn(c, i, root)

        forEachChild(c, childrenFn, forEachChildFn)
    })
}

function rotate<T>(list: T[]){
    if (list.length == 0) return

    list.push(list.shift()!)
}


