import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Rating } from '../model/rating.model';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [HttpClientModule, RouterLink, NgbRatingModule, ReactiveFormsModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit{

  book: Book | undefined;
  ratings: Rating[] = [];
  ratingForm = new FormGroup({
    score: new FormControl(0),
    comment: new FormControl('')
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];

      if (!id) return;

      const url = 'http://localhost:8080/books/' + id;
      this.httpClient.get<Book>(url).subscribe(b => this.book = b);

      // A mayores, se podría llamar a otros controladores y traer más datos
      this.httpClient.get<Rating[]>('http://localhost:8080/ratings/filter-by-book/' + id)
      .subscribe(ratings => this.ratings = ratings);

      // Traer todos los capítulos de un libro
      // /chapters/filter-by-book/id

      // Traer todos los comments de un libro
      // /comments/filter-by-book/id

      // Traer todos las categorías de este libro
      // /categories/filter-by-book/id

      // Traer el autor del libro
      // //authors/filter-by-book/id

    });
  }
save(){

  const rating: Rating = {
    id: 0,
    score: this.ratingForm.get('score')?.value ?? 0,
    comment: this.ratingForm.get('comment')?.value ?? '',  
    book: this.book 

};
this.httpClient.post<Rating>('http://localhost:8080/ratings', rating).subscribe(rating => {

this.ratingForm.reset();

this.httpClient.get<Rating[]>('http://localhost:8080/ratings/filter-by-book/'+ this.book?.id).subscribe (ratings=>this.ratings=ratings)
});
}
}