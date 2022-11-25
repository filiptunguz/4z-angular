import {Component, inject, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {Message, NotifierService} from "../notifier.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  public snackBarRef = inject(MatSnackBarRef<NotificationComponent>);
  public notifier = inject(NotifierService);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: Message) { }

  close() {
    this.notifier.close(this.message.key, this.message.expiresAtRelative);
    this.snackBarRef.dismiss();
  }

  action() {
    this.notifier.action(this.message);
    this.snackBarRef.dismiss();
  }
}
