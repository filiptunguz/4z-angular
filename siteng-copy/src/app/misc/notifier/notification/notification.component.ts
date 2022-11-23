import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {Message, NotifierService} from "../notifier.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public message: Message,
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    private notifier: NotifierService
  ) { }

  close() {
    this.notifier.close(this.message.key, this.message.expiresAtRelative);
    this.snackBarRef.dismiss();
  }

  action() {
    this.notifier.action(this.message);
    this.snackBarRef.dismiss();
  }
}
