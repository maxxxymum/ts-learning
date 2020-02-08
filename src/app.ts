function Logger(logString: string) {
    console.log('LOGGER FACTORY');
    return function(constructor: Function) {
        console.log(logString);
        console.log(constructor);
    }
}

function WithTemplate(template: string, hookId: string) {
    console.log('TEMPLATE FACTORY');

    return function<T extends {new (...args: any[]): {name: string}}>(originalConstructor: T) {
        return class extends originalConstructor {
            constructor(...args: any[]) {
                super();
                console.log('Rendering a template');

                const hookEl = document.getElementById(hookId);
        
                if (hookEl) {
                    hookEl.innerHTML = template;
                    hookEl.querySelector('h1')!.textContent = this.name;
                }
            }
        }
    }
}

@Logger('Logging - Person')
@WithTemplate('<h1>Learning Decorators</h1>', 'app')
class Person {
    name = 'Max';

    constructor() {
        console.log('Creating person object...');
    }
}

const person = new Person();

console.log(person);

function Log(target: any, propertyName: string | Symbol) {
    console.log('Property decorator!');
    console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('Accessor decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log3(
    target: any, 
    name: string | Symbol, 
    descriptor: PropertyDescriptor
) {
    console.log('Method decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) {
    console.log('Parametr decorator!');
    console.log(target);
    console.log(name);
    console.log(position);
}

class Product {
    @Log
    title: string;
    private _price: number;

    constructor(title: string, p: number) {
        this.title = title;
        this._price = p;
    }

    @Log2
    set price(val: number) {
        if (val > 0) {
            this._price = val;
        } else {
            throw new Error('Invalid price - should be positive!')
        }
    }

    @Log3
    getPriceWithTax(@Log4 tax: number) {
        return this._price * (1 + tax);
    }
}

function AutoBind(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = method.bind(this);

            return boundFn;
        }
    };

    return adjDescriptor;
}

class Printer {
    message = 'This works!';
    
    @AutoBind
    showMessage() {
        console.log(this.message);
    }
}

const p = new Printer();

const btn = document.querySelector('button')!;

btn.addEventListener('click', p.showMessage);

interface ValidatorConfig {
    [prop: string]: {
        [validatableProp: string]: string[]
    }
}

const validator: ValidatorConfig = {};

function Required(target: any, propertyName: string) {
    validator[target.constructor.name] = {
        ...validator[target.constructor.name],
        [propertyName]: ['required']
    }
}

function PositiveNumber(target: any, propertyName: string) {
    validator[target.constructor.name] = {
        ...validator[target.constructor.name],
        [propertyName]: ['positive']
    }
}

function validate(obj: any) {
    const objValidator = validator[obj.constructor.name];

    if (!objValidator) {
        return true;
    }

    let isValid = true;

    for (const prop in objValidator) {
        console.log(prop);

        for(const validator of objValidator[prop]) {
            switch (validator) {
                case 'required': {
                    isValid = isValid && !!obj[prop];
                    break;
                }
                case 'positive':
                    isValid = isValid && obj[prop] > 0;
                    break;
            }
        }
    }

    return isValid;
}

class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', event => {
    event.preventDefault();
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const priceEl = document.getElementById('price') as HTMLInputElement;
   
    const title = titleEl.value;
    const price = +priceEl.value;

    const createdCourse = new Course(title, price);

    if (!validate(createdCourse)) {
        throw new Error('Course is not valid!');
        return;
    }

    console.log(createdCourse);
});