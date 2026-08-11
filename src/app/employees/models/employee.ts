interface Employee{
    employeeCode: string,
    fullName: string,
    email: string,
    age: number | null,
    department: Department,
    position: Position,
    address: Address,
    phones: Phone[],
    skills:Skill[],
    password: string,
    confirmPassword: string

}

interface Address{
    country: string,
    city: string,
    street: string,
    postalCode: string
}

interface Phone{
    number: string,
    type: PhoneType,
    isPrimary: boolean
}

interface Skill{
    name: string,
    level: SkillLevel,
    years: number
}
type Department = 'HR' | 'IT' | 'Finance' | 'Sales' | 'Management';
type Position = 'Developer' | 'Senior Developer' | 'Accountant' | 'Manager' | 'HR Specialist' | 'Sales Representative';
type PhoneType = 'Mobile' | 'Work' | 'Home';
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
