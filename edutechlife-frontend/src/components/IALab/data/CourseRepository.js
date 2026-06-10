import { modules, modules_en, ALL_LESSONS, ALL_LESSONS_EN, MODULE_QUESTIONS } from '../../../data/ialab';

export class CourseRepository {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async getCourses(locale) {
    return this.adapter.getCourses(locale);
  }

  async getModules(courseId, locale) {
    return this.adapter.getModules(courseId, locale);
  }

  async getModule(courseId, moduleId, locale) {
    return this.adapter.getModule(courseId, moduleId, locale);
  }

  async getLessons(courseId, moduleId, locale) {
    return this.adapter.getLessons(courseId, moduleId, locale);
  }

  async getLesson(courseId, moduleId, lessonId, locale) {
    return this.adapter.getLesson(courseId, moduleId, lessonId, locale);
  }

  async getQuestions(courseId, moduleId) {
    return this.adapter.getQuestions(courseId, moduleId);
  }

  async getUserProgress(userId, courseId) {
    return this.adapter.getUserProgress(userId, courseId);
  }

  async saveProgress(data) {
    return this.adapter.saveProgress(data);
  }
}

class LocalCourseAdapter {
  getCourses() {
    return [{ id: 1, title: 'IA Lab', slug: 'ialab', localeKey: 'course.ia_lab' }];
  }

  getModules(courseId, locale) {
    const list = locale === 'en' ? modules_en : modules;
    return list.map(m => ({ ...m, courseId }));
  }

  getModule(courseId, moduleId, locale) {
    const list = this.getModules(courseId, locale);
    return list.find(m => m.id === moduleId) || null;
  }

  getLessons(courseId, moduleId, locale) {
    const all = locale === 'en' ? ALL_LESSONS_EN : ALL_LESSONS;
    return (all[moduleId] || []).map(l => ({ ...l, moduleId, courseId }));
  }

  getLesson(courseId, moduleId, lessonId, locale) {
    const lessons = this.getLessons(courseId, moduleId, locale);
    return lessons.find(l => l.id === lessonId) || null;
  }

  getQuestions(courseId, moduleId) {
    return MODULE_QUESTIONS[moduleId] || [];
  }

  getUserProgress(userId) {
    try {
      const data = localStorage.getItem(`course_progress_${userId}`);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  saveProgress({ userId, lessonId, status, score }) {
    try {
      const key = `course_progress_${userId}`;
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      data[lessonId] = { status, score, completed_at: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch {
      return {};
    }
  }
}

export function createCourseRepository(type = 'local') {
  if (type === 'local') {
    return new CourseRepository(new LocalCourseAdapter());
  }
  throw new Error(`Unknown repository type: ${type}`);
}
