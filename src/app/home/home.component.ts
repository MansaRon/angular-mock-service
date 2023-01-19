import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User | null;

  constructor(private accountService: AccountService) {
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void { }

  logout() {
    this.accountService.logout();
  }

}
