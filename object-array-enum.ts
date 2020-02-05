// const person: {
//     name: string;
//     age: number;
//     hobbies: string[];
//     role: [number, string]
// } = {
//     name: 'Max',
//     age: 24,
//     hobbies: ['Sports', 'Cooking'],
//     role: [2, 'author']
// }

enum Role { ADMIN, READ_ONLY, AUTHOR };

const person = {
    name: 'Max',
    age: 24,
    hobbies: ['Sports', 'Cooking'],
    role: Role.ADMIN
}

let favouriteActivities: string[];
favouriteActivities = ['Sports'];

console.log(person.name);

for (const hobby of person.hobbies) {
    console.log(hobby.toUpperCase());
}

if (person.role === Role.ADMIN) {
    console.log('admin');
}