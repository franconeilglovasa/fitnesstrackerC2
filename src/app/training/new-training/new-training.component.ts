import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { UIService } from 'src/app/shared/ui.service';

import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  //exercises: Exercise[] = [];
  //exercises: Observable<any>;
  exercises: Exercise[];
  exerciseSubscription: Subscription;

  isLoading$: Observable<boolean>;

  //isLoading = true;
  private loadingSubscription: Subscription;

  constructor(private store: Store<fromRoot.State>,
    private trainingService: TrainingService, 
    private uiService: UIService) { }
  

  ngOnInit() {
    // this.db.collection('availableExercises').valueChanges().subscribe(result => {
    //   console.log (result);
    // });
    //this.exercises = this.trainingService.getAvailableExercises();

    //this.exercises = this.db.collection('availableExercises').valueChanges();
    // this.db
    //   .collection('availableExercises')
    //   .snapshotChanges()
    //   .pipe(
    //     map(docArray => {
    //       return docArray.map(doc => {
    //         return {
    //           id: doc.payload.doc.id,
    //           ...doc.payload.doc.data() as Exercise
    //         };
    //       });
    //     })
    //   )
    //   .subscribe( result => {
    //     // for (const res of result) {
    //     //   console.log(res.payload.doc.data());
    //     // }
    //     console.log (result);
    //   });

    // this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
    //   isLoading => {
    //     this.isLoading = isLoading;
    //   }
    // );
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (this.exercises = exercises)
    );
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

}
