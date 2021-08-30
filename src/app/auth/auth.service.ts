import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';

// import * as fromApp from '../app.reducer';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';


@Injectable()
export class AuthService {
  // authChange = new Subject<boolean>();
  // //private user: User;
  // private isAuthenticated = false;

  constructor(private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private uiService: UIService,
    private store: Store<fromRoot.State>
    ) { }



  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true);
        this.store.dispatch(new Auth.SetAuthenticated());
        
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.authChange.next(false);
        // this.isAuthenticated = false;
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
      
      }
    });
  }

  registerUser(authData: AuthData) {
    //this.uiService.loadingStateChanged.next(true); 
    //above -->change loading state to 
    //this.store.dispatch({ type: 'START_LOADING' });  
    this.store.dispatch(new UI.StartLoading());

    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.uiService.loadingStateChanged.next(false);
        console.log(result);
        //this.authSuccessfully();
      })
      .catch(error => {
        //this.uiService.loadingStateChanged.next(false);
        //this.store.dispatch({ type: 'STOP_LOADING' });
        this.store.dispatch(new UI.StopLoading());

        console.log(error);
        this.uiService.showSnackbar(error.message, null, 3000);
        // this.snackbar.open(error.message, null, {
        //   duration: 3000
        // });
      });
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    
    //this.authSuccessfully();
  }

  login(authData: AuthData) {
    //this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());

    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        //this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        console.log(result);
        //this.authSuccessfully();
      })
      .catch(error => {
        //this.uiService.loadingStateChanged.next(false);
        //this.store.dispatch({ type: 'STOP_LOADING' });
        this.store.dispatch(new UI.StopLoading());

        console.log(error);
        this.uiService.showSnackbar(error.message, null, 3000);
        // this.snackbar.open(error.message, null, {
        //   duration: 3000
        // });
      });
  }

  logout() {
    // this.trainingService.cancelSubscriptions();
    // this.authChange.next(false);
    // this.router.navigate(['/login']);
    // this.isAuthenticated = false;
    this.afAuth.signOut();
  }



  
  // isAuth() {
  //   return this.isAuthenticated;
  // }

  // private authSuccessfully() {
  //   this.isAuthenticated = true;
  //   this.authChange.next(true);
  //   this.router.navigate(['/training']);
  // }
}
