import { Component, computed, inject, signal } from '@angular/core';
import { TeacherService } from '../../service/teacher';
import { TeacherForm } from "../teacher-form/teacher-form";
import { TeacherList } from "../teacher-list/teacher-list";
import { injectInfiniteQuery, injectMutation, injectMutationState, injectQuery, keepPreviousData, QueryClient } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-teacher-page',
  imports: [TeacherForm, TeacherList],
  standalone: true,
  templateUrl: './teacher-page.html',
  styleUrl: './teacher-page.css',
})export class TeacherPageComponent {

  // ============================================================
  // Dependencies
  // ============================================================

  private _service = inject(TeacherService);

  private queryClient = inject(QueryClient);


  page = signal(1);
  pageSize = signal(5);


  // ============================================================
  // GET ALL TEACHERS
  // ============================================================
  
  teacherQuery = injectQuery(() => ({
    queryKey: ['teachers',{page: this.page(), pageSize: this.pageSize()}],
    queryFn: () =>
      this._service.getPagenationTeachers(this.page(),this.pageSize()),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
    // gcTime: 10_000,
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
    // refetchInterval: 50_000,
    // refetchIntervalInBackground: false,
  }));

  async getTeacherQuery(){
    await this.queryClient.invalidateQueries({
      queryKey: ['teachers']
    })
  };
  
//   teacherInfiniteQuery = injectInfiniteQuery(() => ({
//   queryKey: ['teachers'],

//   initialPageParam: 1,

//   queryFn: ({ pageParam }) =>ماذاذ
//     this._service.getPagenationTeachers(pageParam, 5),

//   getNextPageParam: (lastPage) => {
//     if (lastPage.page >= lastPage.totalPages) {
//       return undefined;
//     }
    
//     return lastPage.page + 1;

//   },

//   getPreviousPageParam: (firstPage) => {
//     return firstPage.page > 1 ? firstPage.page - 1 : undefined;
//   },
  

//   staleTime:5*60*100
  
// }));

// PreviousPage(){
//   this.teacherInfiniteQuery.fetchPreviousPage();
// }

// loadMore(){
//   this.teacherInfiniteQuery.fetchNextPage();
// }

// teachers = computed(() =>
//   this.teacherInfiniteQuery.data()?.pages.flatMap(
//     page => page.items
//   ) ?? []
// );
// printInfinteData() {

//   const data = this.teacherInfiniteQuery.data();

//   console.log('Pages:', data?.pages);
//   console.log('Page Params:', data?.pageParams);

//   console.log(
//     'First Page:',
//     data?.pages[0]?.page
//   );

//   console.log(
//     'Last Page:',
//     data?.pages[data.pages.length - 1]?.page
//   );

//   console.log(
//     'Has Previous Page:',
//     this.teacherInfiniteQuery.hasPreviousPage()
//   );

//   console.log(
//     'Has Next Page:',
//     this.teacherInfiniteQuery.hasNextPage()
//   );
// }

  // ============================================================
  // Editing Teacher
  // ============================================================

  editingTeacher = signal<UpdateTeacherDto | null>(null);


  // ============================================================
  // 1️⃣ PREFETCH QUERY
  // ============================================================

  async prefetchTeacher(id: string) {

    const result = await this.queryClient.prefetchQuery({
      queryKey: ['teacher', id],

      queryFn: () =>
        this._service.getTeacher(id),

      staleTime: 1 * 60 * 1000
    });

    // دائماً undefined
    console.log('prefetch result:', result);


    // لكن البيانات أصبحت موجودة في Cache
    const cachedTeacher =
      this.queryClient.getQueryData<Teacher>(
        ['teacher', id]
      );

    console.log(
      'Teacher in Cache:',
      cachedTeacher
    );
  }


  // ============================================================
  // 2️⃣ FETCH QUERY
  // ============================================================

  async fetchTeacher(id: string) {

    const teacher =
      await this.queryClient.fetchQuery({
        queryKey: ['teacher', id],

        queryFn: () =>
          this._service.getTeacher(id),

        staleTime: 1 * 60 * 1000
      });

    // fetchQuery ترجع البيانات
    console.log(
      'fetchQuery result:',
      teacher
    );
  }


  // ============================================================
  // 3️⃣ ENSURE QUERY DATA
  // ============================================================

  async ensureTeacher(id: string) {

    const teacher =
      await this.queryClient.ensureQueryData({
        queryKey: ['teacher', id],

        queryFn: () =>
          this._service.getTeacher(id),

        staleTime: 1 * 60 * 1000,
        revalidateIfStale:false
      });

    // ensureQueryData ترجع البيانات
    console.log(
      'ensureQueryData result:',
      teacher
    );
  }


  // ============================================================
  // 4️⃣ GET QUERY DATA
  // ============================================================

  getTeacherFromCache(id: string) {

    const teacher =
      this.queryClient.getQueryData<Teacher>(
        ['teacher', id]
      );

    console.log(
      'Teacher from Cache:',
      teacher
    );

    return teacher;
  }


  // ============================================================
  // 5️⃣ REMOVE QUERY FROM CACHE
  // ============================================================

  removeTeacherFromCache(id: string) {

    this.queryClient.removeQueries({
      queryKey: ['teacher', id],
      exact: true
    });

    console.log(
      'Teacher removed from Cache:',
      id
    );
  }


  // ============================================================
  // ADD TEACHER
  // ============================================================

  addTeacherMutation = injectMutation(() => ({

    mutationKey: ['teacher', 'add'],

    mutationFn: (dto: CreateTeacherDto) =>
      this._service.addTeacher(dto),


    onSuccess: (newTeacher) => {

      this.queryClient.setQueryData<Teacher[]>(
        ['teachers'],

        oldTeachers => [
          ...(oldTeachers ?? []),
          newTeacher
        ]
      );

    }

  }));


  // ============================================================
  // EDIT TEACHER
  // ============================================================

  private editTeacherMutation = injectMutation(() => ({

    mutationKey: ['teacher', 'edit'],

    onMutate: () => this.queryClient.cancelQueries({
      queryKey: ['teachers']
    }),

    mutationFn: (dto: UpdateTeacherDto) =>
      this._service.editTeacher(dto),


    onSuccess: (updatedTeacher) => {

      this.queryClient.setQueryData<Teacher[]>(
        ['teachers'],

        oldTeachers =>
          oldTeachers?.map(teacher =>
            teacher.id === updatedTeacher.id
              ? updatedTeacher
              : teacher
          )
      );

    }

  }));


  // ============================================================
  // DELETE TEACHER - OPTIMISTIC UPDATE
  // ============================================================

  deleteTeacherMutation = injectMutation(() => ({

    mutationKey: ['teacher', 'delete'],


    // --------------------------------------------
    // Optimistic Update
    // --------------------------------------------

    onMutate: (id) => {

      this.queryClient.cancelQueries({
        queryKey: ['teachers']
      });

      this.queryClient.setQueryData<Teacher[]>(
        ['teachers'],

        teachers =>
          teachers?.filter(
            teacher => teacher.id !== id
          )
      );

    },


    mutationFn: (id: string) =>
      this._service.deleteTeacher(id),


    onSuccess: (_, id) => {

      console.log(
        'The Teacher with id:',
        id,
        'is Deleted'
      );

    },


    onError: (error) => {

      console.log(
        'Delete failed:',
        error
      );

      // في النسخة الحالية نعيد جلب البيانات
      this.queryClient.invalidateQueries({
        queryKey: ['teachers']
      });

    }

  }));


  // ============================================================
  // TOGGLE TEACHER
  // ============================================================

  private toggleMutation = injectMutation(() => ({

    mutationKey: ['teacher', 'toggle'],


    mutationFn: (id: string) =>
      this._service.toggleTeacher(id),


    onSuccess: (updatedTeacher) => {

      this.queryClient.setQueryData<Teacher[]>(
        ['teachers'],

        oldTeachers =>
          oldTeachers?.map(teacher =>
            teacher.id === updatedTeacher.id
              ? updatedTeacher
              : teacher
          )
      );

    }

  }));


  // ============================================================
  // ADD / EDIT
  // ============================================================

  async onAdd(dto: CreateTeacherDto) {

    const editing =
      this.editingTeacher();


    if (editing) {

      this.editTeacherMutation.mutate({
        id: editing.id,
        name: dto.name,
        subject: dto.subject
      });

    }

    else {

      this.addTeacherMutation.mutate(dto);

    }

  }


  // ============================================================
  // EDIT
  // ============================================================

  onEdit(teacher: Teacher) {

    this.editingTeacher.set(teacher);

  }


  // ============================================================
  // DELETE
  // ============================================================

  onDelete(id: string) {

    this.deleteTeacherMutation.mutate(id);

  }


  // ============================================================
  // TOGGLE
  // ============================================================

  onToggle(id: string) {

    this.toggleMutation.mutate(id);

  }

}
