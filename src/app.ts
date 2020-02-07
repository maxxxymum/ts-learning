type Admin = {
    name: string;
    privileges: string[];
};

type Employee = {
    name: string;
    startDate: Date;
};

type ElevateEmployee = Admin & Employee;

const e1: ElevateEmployee = {
    name: 'Max',
    privileges: ['read', 'write'],
    startDate: new Date(),
}

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number, b: string): string;
function add(a: string, b: number): string;
function add(a: Combinable, b: Combinable) {
    if (typeof a === 'string' || typeof b === 'string') {
        return a.toString() + b.toString();
    }

    return a + b;
}

const result = add('Max', ' Martyn');
result.split(' ');

const fetchedUserData = {
    id: 'u1',
    name: 'Max',
    job: {
        title: 'CEO',
        description: 'My own company'
    }
};

console.log(fetchedUserData?.job?.title);

const userInput = 'null';
const storedData = userInput ?? 'DEFAULT';
console.log(storedData);

type UnknownEmployee = Employee | Admin;

function printEmployee(emp: UnknownEmployee) {
    console.log('Name: ' + emp.name);
    
    if ('privileges' in emp) {
        console.log('Privileges: ' + emp.privileges)
    }

    if ('startDate' in emp) {
        console.log('Start Date: ' + emp.startDate);
    }
}

printEmployee(e1);

class Car {
    drive() {
        console.log('Driving...');
    }
}

class Truck {
    drive() {
        console.log('Driving a car...');
    }

    loadCargo(amount: number) {
        console.log('Loading truck ...' + amount);
    }
}

type Vechile = Car | Truck;

const v1 = new Car();
const v2  = new Truck();

function useVechile(vechile: Vechile) {
    vechile.drive();

    if(vechile instanceof Truck) {
        vechile.loadCargo(100);
    }
}

useVechile(v1);
useVechile(v2);

interface Bird {
    type: 'bird';
    flyingSpeed: number;
}

interface Horse {
    type: 'horse'
    runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
let speed;

    switch (animal.type) {
        case 'bird':
            speed = animal.flyingSpeed;
            break;
        case 'horse':
            speed = animal.runningSpeed;
            break;
        default:
            break;
    }

    console.log('Moving at speed ' + speed);
}

moveAnimal({type: 'bird', flyingSpeed: 10});

// const usernameInput = <HTMLInputElement>document.getElementById('username')!;
const usernameInput = document.getElementById('username');

if (usernameInput) {
    (usernameInput as HTMLInputElement).value = 'Hi there!';
}

interface ErrorContainer { // { email: 'Not a valid email', username: 'Must start with a character!' }
    [prop: string]: string
}

const errorBag: ErrorContainer = {
    email: 'Not a valid email',
    username: 'Not valid username'
}