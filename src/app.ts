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

// ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    container: HTMLDivElement;
    form: HTMLFormElement
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.container = document.getElementById('app')! as HTMLDivElement;
    
        const template = document.importNode(this.templateElement.content, true);
        this.form = template.firstElementChild as HTMLFormElement;
        this.form.id = 'user-input';

        this.titleInput = this.form.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = this.form.querySelector('#description')! as HTMLInputElement;
        this.peopleInput = this.form.querySelector('#people')! as HTMLInputElement;

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
            console.log(title, description, people);
            this.clearInputs();
        }
    }

    private subscribeToEvents() {
        this.form.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.container.insertAdjacentElement('afterbegin', this.form);
    }


}

const input = new ProjectInput(); 