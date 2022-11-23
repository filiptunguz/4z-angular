import { Injectable } from '@angular/core';
import { Message, NotifierInterface } from "../misc/notifier/notifier.service";

@Injectable({
  providedIn: 'root'
})
export class EmptyNotifierService implements NotifierInterface {

  constructor() { }

  trigger(key: string) {};

  action(message: Message) {};

  close(key: string) {};
}
