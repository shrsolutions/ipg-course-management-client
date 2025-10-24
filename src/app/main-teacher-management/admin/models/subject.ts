export class Subject {
  constructor(
    public languageId: number,
    public translation: string,
    public categoryId: number,
    public subjectId: number
  ) {}
}

export interface SubjectList {
  subjectId: number;
  categoryId: number;
  languageId: number;
  translation: string;
  languageName: string;
  isPermanent: boolean;
}
