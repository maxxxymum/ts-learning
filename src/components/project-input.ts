import Component from './base-component';
import * as Validation from '../util/validation';
import { autobind } from '../decorators/autobind'
import { state } from '../state/project-state';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
        const titleValidatable: Validation.Validatable = {
            value: title,
            required: true,
            minLength: 5,
        }
        const descriptionValidatable: Validation.Validatable = {
            value: description,
            required: true,
            minLength: 20
        }
        const peopleValidatable: Validation.Validatable = {
            value: people,
            required: true,
            min: 1,
            max: 10,
        }
        
        return (
            Validation.validate(titleValidatable) &&
            Validation.validate(descriptionValidatable) &&
            Validation.validate(peopleValidatable)
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