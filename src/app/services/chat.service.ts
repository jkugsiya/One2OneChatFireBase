import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AuthenticationService,
} from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';

export interface Message {
  senderId: string;
  createdAt: firebase.firestore.FieldValue;
  msg: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentUser: string;

  constructor(
    private afs: AngularFirestore,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUser.uid;
  }

  getDocId(otherUser) {
    let docId: string;
    if (this.currentUser < otherUser) {
      docId = this.currentUser + otherUser;
    } else {
      docId = otherUser + this.currentUser;
    }
    return docId;
  }

  addChatMessage(msg, toUser) {
    const docId = this.getDocId(toUser);
    const message: Message = {
      senderId: this.currentUser,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      msg,
    };

    return this.afs
      .collection('chats')
      .doc(docId)
      .collection('messages')
      .add(message);
  }

  getChatMessages(fromUser)  {
    return this.afs
      .collection('chats')
      .doc(this.getDocId(fromUser))
      .collection('messages', ref => ref.orderBy('createdAt'))
      .valueChanges()
      .pipe(
        map( messages => {
          for (const m of messages) {
            m.myMsg = this.currentUser === m.senderId;
          }
          return messages;
        })
      ) as Observable<Message[]>;
  }
}
