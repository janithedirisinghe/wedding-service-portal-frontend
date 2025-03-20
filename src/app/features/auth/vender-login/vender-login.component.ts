import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { response } from 'express';
import { Login } from '../../../shared/Models/login.model';

@Component({
  selector: 'app-vender-login',
  templateUrl: './vender-login.component.html',
  styleUrl: './vender-login.component.scss'
})
export class VenderLoginComponent implements OnInit{
  venderLoginForm! : FormGroup;
  isSubmitting: boolean = false;
  constructor( private loginService: AuthService, private fb: FormBuilder,private toaster: ToastrService,private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
      this.spinner.show();
      this.venderLoginForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      })
  }

  onSubmit(){
    if(this.isSubmitting) return;
    this.isSubmitting = true;
    this.spinner.show();

    const formDate = this.venderLoginForm.value;
    const formValues : Login = {
      ...formDate
    }

    this.loginService.login(formValues).subscribe(
      (response: any) => {
          setTimeout(() => {
            this.toaster.success('Login Succesfull');
          }, 500);
          this.venderLoginForm.reset();
          this.spinner.hide();
          this.isSubmitting = false;
        // }
      },
      (error: any) => {
        console.error(error);	
        setTimeout(() => {
          this.toaster.error('Login Failed');
        }
        , 500);
        this.spinner.hide();
        // this.toaster.error('Login Failed');
        this.isSubmitting = false;
      }
    )
  }

}
