import { Student } from '@minamatch/shared';
import { mockStudents } from '../data';
import { apiFetch, getLocalData, setLocalData, DB_KEYS } from './client';

export async function fetchStudents(): Promise<Student[]> {
  try {
    return await apiFetch<Student[]>('/api/students');
  } catch {
    return getLocalData(DB_KEYS.STUDENTS, mockStudents);
  }
}

export async function toggleSyllabus(studentId: string, courseId: string, completed: boolean) {
  try {
    return await apiFetch<{ score: number; status: string; completed: boolean }>(
      `/api/students/${studentId}/syllabus/${courseId}`,
      { method: 'PUT', body: JSON.stringify({ completed }) }
    );
  } catch {
    const students = getLocalData<Student[]>(DB_KEYS.STUDENTS, mockStudents);
    const updated = students.map(s => {
      if (s.id === studentId) {
        const newSyllabus = s.syllabus.map(c =>
          c.id === courseId ? { ...c, completed } : c
        );
        const doneCount = newSyllabus.filter(c => c.completed).length;
        const score = Number(((doneCount / newSyllabus.length) * 100).toFixed(1));
        return {
          ...s,
          syllabus: newSyllabus,
          matchingScore: score,
          status: (doneCount === newSyllabus.length ? 'FINALIZADO' : 'EN_CURSO') as 'FINALIZADO' | 'EN_CURSO'
        };
      }
      return s;
    });
    setLocalData(DB_KEYS.STUDENTS, updated);
    const student = updated.find(s => s.id === studentId);
    return { score: student?.matchingScore || 0, status: student?.status || 'EN_CURSO', completed };
  }
}
