import { Author } from "./author.model";
import { BookType } from "./book-type.enum";
import { Editorial } from "./editorial.model";

export interface Book {
  id: number;
  title: string;
  isbn: string;
  price: number;
  published: boolean;
  releaseDate: Date;
  author: Author;
  editorial: Editorial;
  type: BookType;
}