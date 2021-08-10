import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  currentUserName: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authenticationService: AuthenticationService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async signIn() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authenticationService.signIn(this.loginForm.value).then(
      async (user) => {
        const snap = await this.afs.collection<any>('users').doc(user.user.uid).get().toPromise();
        this.currentUserName = snap.data().data;
        loading.dismiss();
        this.router.navigateByUrl('/users', { replaceUrl: true });
      },
      async (err) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Some problem occured!',
          message: err.message,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
