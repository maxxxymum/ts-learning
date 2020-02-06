// type AddFn = (a: number, b: number) => number;
interface AddFn {
    (a: number, b: number): number;
}

let add: AddFn;

add = (n1: number, n2: number) => (n1 + n2);

interface Named {
    readonly name?: string;
    otuputName?: string;
}

interface Greetable extends Named {
    greet(phrase: string): void
}

class Person implements Greetable {
    constructor(public name?: string) {}

    greet() {
        console.log('Hi!' + ' ' + this.name)
    }
}

let user1: Greetable

user1 = new Person( );

user1.greet('Hi there!');