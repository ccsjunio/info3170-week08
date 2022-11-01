import { Injectable } from '@angular/core';
import { share } from 'rxjs/operators';

export abstract class StorageService {
  public abstract get(): Storage;
}

// tslint:disable-next-line:max-classes-per-file
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends StorageService {
  public get(): Storage {
    return localStorage;
  }
}
