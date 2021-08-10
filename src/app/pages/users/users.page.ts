import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService } from 'src/app/services/chat.service';
import { switchMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: any[];

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router,
    private chatService: ChatService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }

  signOut() {
    this.authenticationService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

  fetchUsers() {
    this.afs
      .collection('users')
      .snapshotChanges()
      .pipe(map((changes) => changes.map((c) => c.payload.doc.data() as Record<any, string>)))
      .subscribe((data) =>  this.users = data);
  }

  openChat(userId, userName) {
    const navigationExtras: NavigationExtras = {state: {toUserId: userId, toName: userName}};
    this.router.navigate(['/users/chat'], navigationExtras);
  }
}
