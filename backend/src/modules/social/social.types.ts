export interface CreateShareDto {
  outfitId?: string;
  caption: string;
  venue?: string;
  occasion?: string;
  tags?: string[];
}

export interface CreateCommentDto {
  text: string;
}
