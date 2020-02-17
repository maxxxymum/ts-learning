// Project Type
enum ProjectStatus { Active, Finished }

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {

    }
}

// Project State Management
type Listener<T> = (item: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>) {
        this.listeners.push(listener);
     }
}

class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, people: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
        );

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

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    container: T;
    element: U;

    constructor(
        templateId: string, 
        containerElementId: string,
        insertAtStart: boolean,
        newElementID?: string,
    ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.container = document.getElementById(containerElementId)! as T;

        const template = document.importNode(this.templateElement.content, true);
        this.element = template.firstElementChild as U;

        if (newElementID) {
            this.element.id = newElementID;
        }

        this.attach(insertAtStart);
    }

    private attach(insertAtBeginnig: boolean) {
        this.container.insertAdjacentElement(
            insertAtBeginnig ? 'afterbegin' : 'beforeend', 
            this.element
        );
    }

    abstract configure(): void;
    abstract renderContent(): void;
}

// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
    private project: Project    

    constructor(listId: string, project: Project) {
        super('single-project', listId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure() {}

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.project.people.toString();
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);
        this.assignedProjects = [];
    
        this.configure();
        this.renderContent();
    }

    configure() {
        state.addListener((projects: Project[]) => {
            this.assignedProjects = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }

                return prj.status === ProjectStatus.Finished;
            });
            this.renderProjects();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() {
        const list = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        list.innerHTML = '';

        for (const project of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, project);
        }
    }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        this.titleInput = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInput = this.element.querySelector('#people')! as HTMLInputElement;

        this.configure();
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent() {}

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
}

const input = new ProjectInput(); 
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');