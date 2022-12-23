import { int } from "../misc/Int";
import { Side } from "../misc/Side";
import {  DisplayMod, Expr } from "../expr/Expr";
import { char } from "../misc/Char";
import { Set } from "immutable";
import { TypeBox } from "../expr/TypeBox";
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
import { PreJSX } from "./PreJsx";

export class MainState {
    private main: Expr = new TypeBox()

    private typeBox: TypeBox | null = this.main as TypeBox
    private typeBoxPos: int = 0

    private zoomPath: Path = Path.EMPTY

    private selectedExpr: Path | null = null
    private subSelectedExpr: Set<int> = Set()

    private normalFormulas: Expr[] = []
    private redundantFormulas: Expr[] = []

    private selectedFormula: int | null = null

    lastUpdated = 0;

    displayMainExpr(): JSX.Element {
        return this.main
            .getFromPath(this.zoomPath)
            .toPreJSX()
            .display(
                r=>this.manipExpr(r, this.zoomPath)
            )
    }

    
    private manipExpr(d: PreJSX, p: Path) {
        if (d.e instanceof TypeBox){
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
    
                console.log(m, typeof m)
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

        d.forEach((c,i)=>{
            if (typeof c == "string") return

            if (c.nthChild == null) return

            this.manipExpr(c, p.add(c.nthChild))
        })

        if (this.selectedExpr == p) {
            d.wrap("Selected")
            return;
        }
        if (p != Path.EMPTY && p.pop() == this.selectedExpr && this.subSelectedExpr.has(p.last())) {
            d.wrap("SubSelected")
            return;
        }
        d.wrap("NotSelected")
    }

    displayFormulas(): JSX.Element {
        let l = this.normalFormulas.map((c, i) => {
            let result: PreJSX = c.toPreJSX()

            if (i == this.selectedFormula) {
                result.wrap("Selected")
            }
            else {
                result.wrap("NotSelected")
            }

            result.addLeftClick(
                () => {                
                    this.selectedFormula = i;
                }    
            )

            return result.display(d=>this.manipExprInFormula(d))
        });

        return (
            <span className="Formulas">
                {l}
            </span>
        );
    }


    private manipExprInFormula(d: PreJSX) {
        if (d.e instanceof TypeBox){
            this.manipTypebox(d)
            return
        }

        d.forEach(c=>{
            if (typeof c == "string") return

            this.manipExprInFormula(c)
        })
    }


    private manipTypebox(d: PreJSX) {
        let t = d.e as TypeBox

        d.addLeftClick(
            ()=>{
                console.log("y")

                if (Date.now() - this.lastUpdated < 10) return
                this.lastUpdated = Date.now()
    
                this.typeBox = t
                this.typeBoxPos = t.contents.length
            }
        )

        if (t == this.typeBox){ 
            d.wrap("Selected");

            if (this.typeBoxPos == 0){
                d.wrap("CursorLeft")
            }
        }

        d.forEach((c,i)=>this.typeBoxContentManip(t, c, i))
    }

    private typeBoxContentManip(parent: TypeBox, d: PreJSX, i: int){
        d.addLeftClick(
            ()=>{
                if (Date.now() - this.lastUpdated < 10) return
                this.lastUpdated = Date.now()
    
                this.typeBox = parent
                this.typeBoxPos = i+1
            }
        )

        if (d.e instanceof TypeBox){
            this.manipTypebox(d)
        }

        if (parent == this.typeBox && i == this.typeBoxPos-1){
            d.wrapOuter("CursorRight")
        }
        else {
            d.wrap("CursorNone")
        }
    }


    private updateFormulas(): void {
        if (this.selectedExpr == null) return

        [this.normalFormulas, this.redundantFormulas] = get(this.main.getFromPath(this.selectedExpr), this.subSelectedExpr);
        this.selectedFormula = null;
    }

    keyDown(key: string|Expr): void {
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
            case "/": this.insert(new Div(new TypeBox(), new TypeBox())); break;
            case "^": this.insert(new Pow(new TypeBox(), new TypeBox())); break;
            case "|": this.insert(new Abs(new TypeBox())); break;
            case "'": this.insert(new Derive(new TypeBox(), new TypeBox())); break;
            case "(": this.insert(new TypeBox()); break;
            default: if (key.length == 1) {
                this.insert(key);
            }
        }
    }

    private insert(c: char | Expr) {
        if (this.typeBox == null) return

        let flag = this.typeBox.insert(this.typeBoxPos, c)

        if (flag instanceof TypeBox){
            this.typeBox = flag
            this.typeBoxPos = 0
        }
        else if (typeof flag == "number") {
            this.typeBoxPos = flag
        }

        this.lastUpdated = Date.now();
    }

    private delete() {
        if (this.typeBox == null) return

        if (this.typeBoxPos == 0) return

        this.typeBox.contents.splice(this.typeBoxPos - 1, 1);
        this.typeBoxPos -= 1;

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
        let contents = (e: Expr): (Expr|char)[] =>{
            if (e instanceof TypeBox){
                return e.contents
            }
            return e.children.filter(c=>c instanceof TypeBox).toArray()
        }

        let parent = (e: Expr): [Expr,int]|null=>{
            let find = (p: Expr): [Expr,int]|null=>{
                for (let i = 0; i < contents(p).length; i++){
                    let c = contents(p)[i]
    
                    if (c == e) return [p, i]
    
                    if (typeof c == "string") continue
    
                    if (find(c) != null){
                        return find(c)
                    }
                }
                return null
            }
    
            return find(this.main) ?? this.normalFormulas.map(c=>find(c)).find(c=>c!=null) ?? null
        }

        let maxI = (e: Expr):int=>{
            if (e instanceof TypeBox) return e.contents.length+1
    
            return e.children.filter(c=>c instanceof TypeBox).size
        }

        if (this.typeBox == null) return

        let r = this.typeBox as Expr
        let i = this.typeBoxPos + side.val()

        let exited = false

        while (true){
            if (i >= maxI(r)){
                [r, i] = parent(r) ?? [r, -1]

                i+=1
                
                exited = true
                continue
            }
            if (i < 0){
                [r, i] = parent(r) ?? [r, maxI(r)]

                if (!(r instanceof TypeBox)) i-=1

                exited = true
                continue
            }

            if (r instanceof TypeBox){
                let maybeInner = (() => {
                    if (side == Side.RIGHT) {
                        return contents(r)[i - 1]
                    }
                    return contents(r)[i];
                })()
    
                if (!(typeof maybeInner == "string") && !exited){
                    r = maybeInner
    
                    if (side == Side.LEFT){
                        i = maxI(r)-1
                    } else {
                        i = 0
                    }
                    continue
                }
                break
            }
            else {
                r = r.children.filter(c=>c instanceof TypeBox).get(i)!

                if (side == Side.LEFT){
                    i = maxI(r)-1
                } else {
                    i = 0
                }
            }
        }

        this.typeBox = r
        this.typeBoxPos = i

        this.lastUpdated = Date.now()
    }

    private enter() {
        if (this.main instanceof TypeBox) {
            this.main = this.main.parse();
            this.updateFormulas();

            this.lastUpdated = Date.now();
        }
        else if (this.selectedFormula != null && this.selectedExpr != null) {
            
            if (this.selectedFormula < this.normalFormulas.length){
                this.main = this.main.setFromPath(this.selectedExpr, this.normalFormulas[this.selectedFormula].parse());
            }
            else {
                this.main = this.main.setFromPath(this.selectedExpr, this.redundantFormulas[this.selectedFormula-this.normalFormulas.length].parse());
            }

            this.selectedExpr = null;
            this.normalFormulas = [];
            this.redundantFormulas = []

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

        result.normalFormulas = this.normalFormulas.map(c => c.clone(cloneMap));
        result.selectedFormula = this.selectedFormula;

        result.lastUpdated = this.lastUpdated;

        return result;
    }
}


