import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService } from 'src/app/services/chat.service';
import { LoginPage } from '../../login/login.page';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  currentUserId: string;
  currentUserName: string;
  public toName: string;
  messages: any;
  newMsg = '';
  private toUserId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private authenticationService: AuthenticationService,
    private loginData: LoginPage
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.toUserId =
          this.router.getCurrentNavigation().extras.state.toUserId;
        this.toName = this.router.getCurrentNavigation().extras.state.toName;
      }
    });
  }

  ngOnInit() {
    this.currentUserId = this.authenticationService.currentUser.uid;
    this.currentUserName = this.loginData.currentUserName;
    this.messages = this.chatService.getChatMessages(this.toUserId);
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg, this.toUserId).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }
}
