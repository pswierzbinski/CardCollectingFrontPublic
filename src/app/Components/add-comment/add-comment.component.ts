import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
@Component({
  selector: 'app-add-comment',
  imports: [ReactiveFormsModule, TuiTextfield, FormsModule, CommonModule],
  templateUrl: './add-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './add-comment.component.css'
})
export class AddCommentComponent {
  protected value: string = 'A';
  protected addCommentForm = new FormGroup({
    value: new FormControl('', [Validators.minLength(0), Validators.maxLength(256)]),
  });
  ngOnInit() {
    this.addCommentForm.markAsPristine();
  }
  @Output() addComment = new EventEmitter<string>();
  protected onSubmit(): void {
    if (this.addCommentForm.valid) {
      let tmp = this.addCommentForm.get('value')?.value;
      if (tmp)
        this.addComment.emit(tmp);
      this.addCommentForm.reset();
    }
  }
}
