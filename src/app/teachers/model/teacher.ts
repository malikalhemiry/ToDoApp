interface Teacher {
  id: number;
  name: string;
  subject: string;
  isActive: boolean;
}

interface CreateTeacherDto {
  name: string;
  subject: string;
}