import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Book } from '../model/book.model';
import { RouterLink } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [HttpClientModule, RouterLink, NgbAlertModule,DatePipe],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {

books: Book[]=[];
showDeletedBookMessage: boolean=false;
isAdmin = false;

constructor(
private httpClient: HttpClient,
private authService: AuthenticationService) {
this.authService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin);
}

  
ngOnInit(): void {
  this.loadBooks(); 
}
delete(book:Book){
  const url ='http://localhost:8080/books/'+ book.id;
  this.httpClient.delete<Book>(url).subscribe(response =>{
     this.loadBooks()
     this.showDeletedBookMessage=true;
    })
}
  private loadBooks() {
    const url = 'http://localhost:8080/books';
    this.httpClient.get<Book[]>(url).subscribe(books => {
      console.log(books);
      this.books = books;
      
    });
  }
 
  hideDeletedBookMessage() {
    this.showDeletedBookMessage = false;
    }

}
