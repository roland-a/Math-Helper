import { int } from "./Int"

export class Side{
    static LEFT = new Side("left")
    static RIGHT = new Side("right")

    name: string

    private constructor(name: string){
        this.name = name
    }

    val():int{
        if (this==Side.LEFT){
            return -1
        }
        return 1
    }

    other():Side{
        if (this==Side.LEFT){
            return Side.RIGHT
        }
        return Side.LEFT
    }
}