export class videoLinkForm {
  constructor(
    public subtopicAttachmentFile: string,
    public id: number,
    public subtopicId: number,
    public AttachmentTypeId: number,
    public languageId: number,
    public value: number,
    public description: string
  ) {}
}

export interface VideoLinkList {
  id: number;
  subtopicId: number;
  attachmentTypeId: number;
  languageId: number;
  value: string;
  description: string;
}
