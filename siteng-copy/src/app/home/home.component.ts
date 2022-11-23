import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {HeaderComponent} from "../app-layout/header/header.component";
import {AuthService} from "../auth/services/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  authService = inject(AuthService);

  loadUser() {
    this.authService.loadUserFromApiKey();
  }
}
