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

    private gatherUserInfo(): [string, string, number] | void {
        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const people = this.peopleInput.value;

        if (
            title.trim().length === 0 || 
            description.trim().length === 0 || 
            people.trim().length === 0
        ) {
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