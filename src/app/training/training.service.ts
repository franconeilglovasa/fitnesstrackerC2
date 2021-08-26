import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { Exercise } from './exercise.model';



@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();

  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  //private finishedExercises: Exercise[] = [];

  private fbSubs: Subscription[] = [];


  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data() as Exercise
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        console.log (exercises);
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }));
  }

  startExercise(selectedId: string) {
    //select a single documemnt and update it
    // this.db.doc ('availableExercises/' + selectedId).update({
    //   lastSelected: new Date()
    // });

    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  // getCompletedOrCancelledExercises() {
  //   return this.finishedExercises.slice();
  // }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
        // console.log ("exercises fetch",exercises);
        // return exercises;
      }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
