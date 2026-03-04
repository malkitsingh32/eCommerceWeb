import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.scss',

})
export class Snackbar {
 constructor(
    private snackBarRef: MatSnackBarRef<Snackbar>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData
  ) { }

  ngOnInit(): void {
  }

  actionFn() {
    this.snackBarRef.dismissWithAction();
  }
}
