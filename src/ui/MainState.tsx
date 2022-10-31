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
        let e = this.main.getFromPath(this.zoomPath)

        return <span className="MainExpr">
            {e.display(this.exprDisplayer(e, this.zoomPath))}
        </span>;
    }

    displayFormulas(): JSX.Element {
        let l = this.normalFormulas.map((c, i) => {
            let onClick = () => {
                if (this.selectedFormula == i)
                    return;

                this.selectedFormula = i;

                this.lastUpdated = Date.now();
            };

            if (i == this.selectedFormula) {
                return <span className="Selected">{c.display(this.formulaDisplayer(c))}</span>
            }
            else {
                return <span className="NotSelected" onClick={onClick}>{c.display(this.formulaDisplayer(c))}</span>
            }
        });

        let r = this.redundantFormulas.map((c, i) => {
            let onClick = () => {
                if (this.selectedFormula == i + this.normalFormulas.length) return

                this.selectedFormula = i + this.normalFormulas.length

                this.lastUpdated = Date.now();
            };

            if (i + this.normalFormulas.length == this.selectedFormula) {
                return <span className="Selected">{c.display(this.formulaDisplayer(c))}</span>
            }
            else {
                return <span className="NotSelected" onClick={onClick}>{c.display(this.formulaDisplayer(c))}</span>
            }
        });

        return (
            <span className="Formulas">
                Equivalences
                <span>
                    <span>{l}</span>
                    <span>{r}</span>
                </span>
            </span>
        );
    }

    private exprDisplayer(e: Expr, p: Path): DisplayMod {
        if (e instanceof TypeBox) {
            return this.typeBoxDisplayer(null, 0, e);
        }

        return {
            wrap: (jsx: JSX.Element): JSX.Element => {
                let onClick = () => {
                    if (Date.now() - this.lastUpdated < 10) return

                    if (this.selectedExpr == p) return

                    this.selectedExpr = p;
                    this.subSelectedExpr = Set();

                    this.updateFormulas();

                    this.lastUpdated = Date.now()

                    let m = this.main.getFromPath(this.selectedExpr)

                    console.log(m, typeof m)
                };

                let onRightClick = () => {
                    if (Date.now() - this.lastUpdated < 10)
                        return;

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
                };

                if (this.selectedExpr == p) {
                    return <span className="Selected">{jsx}</span>;
                }
                if (p != Path.EMPTY && p.pop() == this.selectedExpr && this.subSelectedExpr.has(p.last())) {
                    return <span className="SubSelected" onContextMenu={onRightClick}>{jsx}</span>;
                }

                return <span className="NotSelected" onClick={onClick} onContextMenu={onRightClick}>{jsx}</span>;
            },

            next: (i: int, e: Expr) => {
                return this.exprDisplayer(e, p.add(i));
            }
        };
    }

    private typeBoxDisplayer(parent: Expr | null, i: int | null, content: Expr | null): DisplayMod {
        return {
            wrap: (jsx: JSX.Element): JSX.Element => {
                let onContentClick = () => {
                    if (Date.now() - this.lastUpdated < 10)
                        return;

                    if (!(parent instanceof TypeBox))
                        return;
                    if (this.typeBox == parent && this.typeBoxPos == i! + 1)
                        return;

                    this.typeBox = parent;
                    this.typeBoxPos = i! + 1;

                    this.lastUpdated = Date.now();
                };

                let onEmptyClick = () => {
                    if (Date.now() - this.lastUpdated < 10)
                        return;

                    if (!(content instanceof TypeBox))
                        return;

                    if (this.typeBox == content && this.typeBoxPos == 0)
                        return;

                    this.typeBox = content;
                    this.typeBoxPos = 0;

                    this.lastUpdated = Date.now();
                };

                if (this.typeBox != content && content instanceof TypeBox && content.contents.length == 0) {
                    jsx = <span onClick={onEmptyClick} className="TypeBox"></span>;
                }
                if (this.typeBox == content && content instanceof TypeBox && content.contents.length == 0) {
                    jsx = <span onClick={onEmptyClick} className="TypeBox"><span className="CursorBlinkMiddle"></span></span>;
                }

                if (parent instanceof TypeBox && content instanceof TypeBox) {
                    jsx = <span className="Wrapped">{jsx}</span>;
                }
                if (content != null && content == this.typeBox) {
                    jsx = <span className="Selected">{jsx}</span>;
                }

                if (parent != null && parent == this.typeBox && this.typeBoxPos == i) {
                    jsx = <span className="CursorLeft" onClick={onContentClick}>{jsx}</span>;
                }
                else if (parent != null && parent == this.typeBox && this.typeBox == parent && i == this.typeBox.contents.length - 1 && this.typeBoxPos == this.typeBox!.contents.length) {
                    jsx = <span className="CursorRight" onClick={onContentClick}>{jsx}</span>;
                }
                else if (parent != null) {
                    jsx = <span className="CursorNone" onClick={onContentClick}>{jsx}</span>;
                }

                return jsx;
            },

            next: (i: int, e: Expr) => {
                return this.typeBoxDisplayer(content, i, content == e ? null : e);
            }
        };
    }

    private formulaDisplayer(e: Expr): DisplayMod {
        if (e instanceof TypeBox) {
            return this.typeBoxDisplayer(null, null, e);
        }

        return {
            wrap: (jsx: JSX.Element): JSX.Element => {
                return jsx;
            },

            next: (i: int, e: Expr) => {
                return this.formulaDisplayer(e);
            }
        };
    }

    private updateFormulas(): void {
        if (this.selectedExpr == null)
            return;

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


