interface Teacher {
  id: string;
  name: string;
  subject: string;
  isActive: boolean;
}

interface CreateTeacherDto {
  name: string;
  subject: string;
}

interface UpdateTeacherDto {
  id: string;
  name: string;
  subject: string;
}