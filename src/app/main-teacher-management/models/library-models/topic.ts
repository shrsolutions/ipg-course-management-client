export interface TopicList {
  languageId: number;
  translation: string;
  languageName: string;
  isPermanent: boolean;
  topicId: number;
  subjectId: number;
  categoryId: number;
}
export class TopicForm {
  constructor(
    public languageId: number,
    public translation: string,
    public subjectId: number,
    public topicId: number
  ) {}
}
