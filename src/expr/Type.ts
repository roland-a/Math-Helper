export class Type{
    static Bool = new Type("bool")
    static Num = new Type("num")
    static Var = new Type("var")
    
    readonly name: string

    private constructor(name: string){
        this.name = name
    }

    canBe(t: Type){
        if (this == Type.Var) return true

        return this == t
    }

    overlaps(t: Type){
        if (this == Type.Var) return true
        if (t == Type.Var) return true

        return this == t
    }
}