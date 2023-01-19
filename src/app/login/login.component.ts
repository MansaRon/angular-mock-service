import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required, 
      Validators.email, 
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {return;}

    this.loading = true;
    this.accountService.login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/success';
          this.router.navigateByUrl(returnUrl);
        },
        error: error => {
          alert(error);
          this.loading = false;
        }
      });
  }

}
