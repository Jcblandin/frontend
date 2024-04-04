import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Author } from '../model/author.model';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [HttpClientModule, RouterLink],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css'
})
export class AuthorListComponent implements OnInit{
authors: Author[]=[];

constructor(private httpClient: HttpClient){
  
}
  ngOnInit(): void {
   this.httpClient.get<Author[]>('http://localhost:8080/authors')
   .subscribe(authors => this.authors = authors);
  
   }
   
  }

