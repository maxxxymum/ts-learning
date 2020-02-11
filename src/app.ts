// Project State Management
class ProjectState {
    private listeners: any[] = [];
    private projects: any[] = [];
    private static instance: ProjectState;

    private constructor() {}

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listener: Function) {
       this.listeners.push(listener);
    }

    addProject(title: string, description: string, people: number) {
        const newProject = {
            id: Math.random().toString(),
            title,
            description,
            people
        }

        this.projects.push(newProject);

        for(const listener of this.listeners) {
            listener([...this.projects]);
        }
    } 
}

const state = ProjectState.getInstance();

// Validation
interface Validatable {
    value: string | number;
    required: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(input: Validatable) {
    let isValid = true;

    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }

    if (input.minLength != null && typeof input.value === 'string') {
        isValid = isValid && input.value.length > input.minLength;
    }

    if (input.maxLength != null && typeof input.value === 'string') {
        isValid = isValid && input.value.length < input.maxLength;
    }

    if (input.min != null && typeof input.value === 'number') {
        isValid = isValid && input.value >= input.min;
    }

    if (input.max != null && typeof input.value === 'number') {
        isValid = isValid && input.value <= input.max;
    }

    return isValid;
}

// autobind decorator
function autobind(
    target: any, 
    methodName: string, 
    descriptor: PropertyDescriptor
) {
    const method = descriptor.value;
    const ecnhancedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundMethod = method.bind(this);

            return boundMethod;
        }
    }

    return ecnhancedDescriptor;
}

// ProjectList Class
class ProjectList {
    templateElement: HTMLTemplateElement;
    container: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: any[];

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.container = document.getElementById('app')! as HTMLDivElement;
        this.assignedProjects = [];
    
        const template = document.importNode(this.templateElement.content, true);
        this.element = template.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;

        state.addListener((projects: any[]) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });

        this.attach();
        this.renderContent();
    }

    private renderProjects() {
        const list = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        for (const project of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = project.title;

            list.appendChild(listItem);
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach() {
        this.container.insertAdjacentElement('beforeend', this.element);
    }
}

// ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    container: HTMLDivElement;
    elemnt: HTMLFormElement
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.container = document.getElementById('app')! as HTMLDivElement;
    
        const template = document.importNode(this.templateElement.content, true);
        this.elemnt = template.firstElementChild as HTMLFormElement;
        this.elemnt.id = 'user-input';

        this.titleInput = this.elemnt.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = this.elemnt.querySelector('#description')! as HTMLInputElement;
        this.peopleInput = this.elemnt.querySelector('#people')! as HTMLInputElement;

        this.subscribeToEvents();
        this.attach();
    }

    private validteUserInfo(title: string, description: string, people: number) {
        const titleValidatable: Validatable = {
            value: title,
            required: true,
            minLength: 5,
        }
        const descriptionValidatable: Validatable = {
            value: description,
            required: true,
            minLength: 20
        }
        const peopleValidatable: Validatable = {
            value: people,
            required: true,
            min: 5,
            max: 10,
        }
        
        return (
            validate(titleValidatable) &&
            validate(descriptionValidatable) &&
            validate(peopleValidatable)
        );
    }

    private gatherUserInfo(): [string, string, number] | void {
        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const people = this.peopleInput.value;

        if (!this.validteUserInfo(title, description, +people)) {
            alert('Invalid input, please try again!');
            return;
        } else {
            return [title, description, +people];
        }
    }

    private clearInputs() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInfo = this.gatherUserInfo();

        if (Array.isArray(userInfo)) {
            const [title, description, people] = userInfo;
            state.addProject(title, description, people);
            this.clearInputs();
        }
    }

    private subscribeToEvents() {
        this.elemnt.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.container.insertAdjacentElement('afterbegin', this.elemnt);
    }
}

const input = new ProjectInput(); 
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');