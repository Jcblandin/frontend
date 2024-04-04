import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Book } from '../model/book.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Reservation } from '../model/reservation.model';
import { CurrencyPipe } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [HttpClientModule,ReactiveFormsModule, CurrencyPipe,NgbAlertModule,RouterLink],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit {

book: Book | undefined;
reservation: Reservation | undefined;
reservationForm = new FormGroup({
  startDate: new FormControl(new Date()),
  finishDate: new FormControl (new Date()),
  isPremiumShip: new FormControl<boolean>(false),
  extraService: new FormControl<string>('0')
});
bookPrice=0;//precio del libro por día
shipPrice= 0; //precio de envío
extraPrice=0; //precio de servicios extra
totalPrice=0; //suma de los anteriores
numDays=0;
showFinishMessage=false;
constructor(
  private httpClient:HttpClient,
  private activatedRoute: ActivatedRoute){}
ngOnInit(): void {
  this.activatedRoute.params.subscribe(params =>{
    const id= params['id'];
    if(!id){
      return;
    }
   
    this.httpClient.get<Book>('http://localhost:8080/books/'+id)
    .subscribe(book =>this.book=book);
    
   
})

}
calculatePrice(){
let startDate= this.reservationForm.get('startDate')?.value;
let finishDate= this.reservationForm.get('finishDate')?.value;
if(!startDate || !finishDate || !this.book || !this.book.price){
  return;
}
startDate =new Date(startDate);
finishDate = new Date(finishDate);

const diffMilliseconds = finishDate.getTime() - startDate.getTime();
if(diffMilliseconds<=0){
  this.bookPrice=0;
  this.numDays=0;
  this.totalPrice=0;
  return;
}
this.numDays= Math.round(diffMilliseconds/(1000*60*60*24));
if(this.numDays<=0){
  this.bookPrice=0;
  this.numDays=0;
  this.totalPrice=0;
  return;
}

this.bookPrice= this.numDays*this.book.price;
this.totalPrice=this.bookPrice
if(this.reservationForm.get('isPremiumShip')?.value){
  this.shipPrice=4.99;
  this.totalPrice +=this.shipPrice;
}else{
  this.shipPrice=0;
}

const extra= this.reservationForm.get('extraService')?.value || '0';
console.log(extra);
console.log(typeof extra);
console.log(typeof Number(extra));
this.extraPrice= Number(extra);
this.totalPrice+=this.extraPrice;



}
save(){
const startDate=this.reservationForm.get('startDate')?.value;
const finishDate=this.reservationForm.get('finishDate')?.value;

  if(!startDate || !finishDate || !this.book){
    return;
  }
  const reservation: Reservation={
    id:0,
    startDate: startDate,
    finishDate:  finishDate,
    price: this.totalPrice,
    book: this.book

  };
  //enviar a backend con httpClient post
  this.httpClient.post<Reservation>('http://localhost:8080/reservations', reservation)
  .subscribe(reservation => {
    this.reservation=reservation;
    this.showFinishMessage =true;

  })
}
}
