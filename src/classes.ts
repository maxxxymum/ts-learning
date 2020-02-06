abstract class Department {
    static fiscalYear = 2020;
    protected employees: string[] = [];

    constructor(protected readonly id: number, public name: string) {
    }

    static createEmployee(name: string) {
        return { name }
    }

    abstract describe(this: Department): void;

    addEmployee(employee: string) {
        this.employees.push(employee);
    }

    printEmployeeInfo() {
        console.log(this.employees.length)
        console.log(this.employees)
    }
}

class ITDepartment extends Department {
    constructor(id: number, public admins: string[]) {
        super(id, 'IT');
    }

    describe() {
        console.log('IT Department');
    }
}

class AccountingDepartment extends Department {
    private lastReport: string;
    private static instance: AccountingDepartment;

    get mostRecentReport() {
        if(this.lastReport) {
            return this.lastReport;
        }
        throw new Error('No report found.');
    }

    set mostRecentReport(value: string) {
        if (!value) {
            throw new Error('Please provide a valid value');
        }

        this.addReport(value);
    }

    private constructor(id: number, private reports: string[]) {
        super(id, 'Accounting');
        this.lastReport = reports[0];
    }

    static getInstance() {
        if (AccountingDepartment.instance) {
            return AccountingDepartment.instance;
        }

        AccountingDepartment.instance = new AccountingDepartment(2, [])
        
        return AccountingDepartment.instance;
    }

    describe() {
        console.log('Accounting Department');
    }

    addEmployee(name: string) {
        if (name === 'Max') {
            return;
        }

        this.employees.push(name);
    }

    addReport(text: string) {
        this.reports.push(text);
        this.lastReport = text;
    }

    printReports() {
        console.log(this.reports)
    }
}

const employee1 = Department.createEmployee('Yonas')
console.log(employee1, Department.fiscalYear);

const it = new ITDepartment(1, ['Max']);

it.addEmployee('Max');
it.addEmployee('Zolaa');

it.describe();
it.printEmployeeInfo();

const accounting = AccountingDepartment.getInstance();

accounting.mostRecentReport = 'Report';
accounting.addReport('Everything good');
console.log(accounting.mostRecentReport);

accounting.addEmployee('Max');
accounting.addEmployee('Ann');

accounting.printReports();
accounting.printEmployeeInfo();