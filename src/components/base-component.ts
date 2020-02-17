export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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