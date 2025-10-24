export class Category {
  constructor(
    public languageId: number,
    public translation: string,
    public categoryId: number
  ) {}
}

export interface CategoryResult {
  categoryId: number;
  languageId: number;
  translation: string;
  languageName: string;
  isPermanent: boolean;
}
