import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';



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

  constructor(private trainingService: TrainingService) { }
  

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

    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (this.exercises = exercises)
    );
    this.trainingService.fetchAvailableExercises();

  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }

}
