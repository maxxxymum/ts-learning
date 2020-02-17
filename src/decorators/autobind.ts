namespace App {
    export function autobind(
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
}