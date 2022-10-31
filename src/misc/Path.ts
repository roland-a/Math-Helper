import { List } from "immutable";
import { int } from "./Int";
import { pool } from "./Pooler";

export class Path{
    static EMPTY = pool(new Path(List()))

    private value: List<int>

    private constructor(value: List<int>){
        this.value = value
    }

    add(value: int): Path{
        return pool(new Path(this.value.push(value)))
    }

    pop(): Path{
        if (this == Path.EMPTY) throw "remove"

        return pool(new Path(this.value.remove(this.value.size-1)))
    }

    last(): int{
        if (this == Path.EMPTY) throw new Error()

        return this.value.last()
    }

    recurse<T>(t: T, fn: (_:T,__:int)=>T): T{
        if (this == Path.EMPTY) return t

        let nextPath = pool(new Path(this.value.remove(0)))
        let nextT = fn(t,this.value.first())

        return nextPath.recurse(nextT, fn)
    }

    replace<T>(t: T, getter: (_0:T, _1:int)=>T, setter: (_0:T, _1:int, _2: T)=>T, replacement:T): T{
        if (this == Path.EMPTY) return replacement

        let nextPath = pool(new Path(this.value.remove(0)))

        return setter(
            t,
            this.value.first(),
            nextPath.replace(
                getter(t, this.value.first()),
                getter,
                setter,
                replacement
            ),
        )
    }
}