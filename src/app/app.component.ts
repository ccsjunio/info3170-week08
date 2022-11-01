import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from './services/cart.service';
import { Observable, Observer, Subscription } from 'rxjs';
import { CartItem } from './models/cart-item';
import { ShoppingCart } from './models/shopping-cart';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  Event as NavigationEvent,
} from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public cart: Observable<ShoppingCart>;
  public cartItems: CartItem[];
  public itemCount: number;

  private _cartSubscription: Subscription;

  public routeFound: boolean = false;
  private _event$;
  private _routes;

  constructor(private _cartService: CartService, private _router: Router) {
    this._routes = this._router.config
      .map((route) => route.path)
      .filter((route) => route != '**');
    this._event$ = this._router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        let url = event.url.split('/')[1];
        this._routes.filter((route) => {
          if (route.split('/')[0] == url) {
            this.routeFound = true;
          }
        });
      }
    });
  }

  public ngOnInit(): void {
    this.cart = this._cartService.get();
    this._cartSubscription = this.cart.subscribe((cart) => {
      this.itemCount = cart.items
        .map((x) => x.quantity)
        .reduce((p, n) => p + n, 0);
    });
  }

  public ngOnDestroy(): void {
    if (this._cartSubscription) {
      this._cartSubscription.unsubscribe();
    }
  }
}
