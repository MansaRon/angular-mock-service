import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { emailValidator } from '../helpers/email-validator';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  invalidEmail: boolean = false;
  invalidPassword: boolean = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required, Validators.email],
      password: ['', [ Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]
      ]
    });
  }

  get f() { return this.form.controls; }

  public ValidateEmail(input: string): boolean {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
      return true;
    } 
    else {
      alert("Invalid email address!");
      return false;
    }
  }

  public validatePassword(input: string): boolean {
    var validRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}/;
    if (input.match(validRegex)) {
      alert("Password must contain more than 8 characters, 1 upper case letter, and 1 special character.");
      return false;
    } 
    else {
      return true;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) { return; }

    if (!this.ValidateEmail(this.form.value.username)) {
      this.invalidEmail = true;
      return;
    }

    console.log(this.form.value);

    if (!this.validatePassword(this.form.value.password)) {
      this.invalidPassword = true;
      return;
    }

    console.log('success');
    this.loading = true;
    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          alert('Registration successful');
          this.router.navigate(['/login'], { relativeTo: this.route });
        },
        error: error => {
          console.log(error);
          alert(error);
          this.loading = false;
        }
      });
  }

}
