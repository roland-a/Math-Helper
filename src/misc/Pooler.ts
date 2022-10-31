import { List, Map } from "immutable";

let map = Map<List<any>,any>()

export function pool<T extends Object>(value: T): T{
    let l = List(Object.values(value))

    if (!map.has(l)){
        map = map.set(l, value)
    }
    return map.get(l)!
}

