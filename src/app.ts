class Department {
    private employees: string[] = [];

    constructor(private readonly id: number, public name: string) {
    }

    describe(this: Department) {
        console.log(`Depatment ${this.id} - ${this.name}`);
    }

    addEmployee(employee: string) {
        this.employees.push(employee);
    }

    printEmployeeInfo() {
        console.log(this.employees.length)
        console.log(this.employees)
    }
}

const rnd = new Department(1, 'R&D');

rnd.addEmployee('Max');
rnd.addEmployee('Zolaa');

rnd.describe();
rnd.printEmployeeInfo();

// const rndCopy = { name: 's', describe: rnd.describe }

// rndCopy.describe();