export interface SubtopicList {
  languageId: number;
  translation: string;
  languageName: string;
  isPermanent: boolean;
  subtopicId: number;
  topicId: number;
  subjectId: number;
  categoryId: number;
}

export class SubtopicForm {
  constructor(
    public languageId: number,
    public translation: string,
    public subtopicId: number,
    public topicId: number
  ) {}
}
