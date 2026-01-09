import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
} from "@angular/core";
import { IComment } from "app/entities/models/nk-comment.model";
import { IPost } from "app/entities/models/nk-post.model";
import { AlertService } from "app/shared/alert/alert.service";
import { finalize, Observable } from "rxjs";
import { CommentService, EntityResponseType } from "../nk-comment.service";

@Component({
  selector: "app-comment-update",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./nk-comment-update.component.html",
  styleUrl: "./nk-comment-update.component.scss",
})
export class CommentUpdateComponent implements AfterViewInit {
  /**
   * *bold*
   * _underline_
   * ~italics~
   * -delete-
   * @param text
   * @returns
   */
  format(text: string): string {
    return text
      .replace(/\*(.*?)\*/g, "<b>$1</b>") // -> bold
      .replace(/_(.*?)_/g, "<u>$1</u>") // -> underline
      .replace(/~(.*?)~/g, "<i>$1</i>") // -> italic
      .replace(/-(.*?)-/g, "<del>$1</del>"); // -> delete
  }

  @ViewChild("nkeditor", { static: false }) nkeditor: ElementRef<HTMLElement>;
  commentService = inject(CommentService);
  alertService = inject(AlertService);

  @Input() comment: IComment = null;
  @Input() post: IPost;
  @Output() onSaveSuccess = new EventEmitter<IComment>();

  file: File = null;
  isSaving = signal(false);
  isEmpty = signal(true);
  imageSrc = signal(null);
  editor: HTMLElement = null;

  ngAfterViewInit(): void {
    this.editor = this.nkeditor.nativeElement.querySelector(".nk-editor");
    if (this.comment) {
      this.editor.innerHTML = this.comment.content;
      this.imageSrc.set(this.comment.url || null);
      this.updateEditorView();
    }
    // Function to check if the editor is empty
    this.editor.addEventListener("input", () => this.updateEditorView());
  }

  private updateEditorView() {
    const content = this.editor.textContent.trim(); // Trim spaces and line breaks
    if (content == "") {
      this.isEmpty.set(true);
      // If the content is empty, add the 'placeholder' class
      this.editor.classList.add("placeholder");
    } else {
      this.isEmpty.set(false);
      // If the content is not empty, remove the 'placeholder' class
      this.editor.classList.remove("placeholder");
    }
  }

  save() {
    this.isSaving.set(true);
    if (this.comment != null && this.comment.id != null) {
      const comment = {
        ...this.comment,
        post: { id: this.post.id },
        content: this.editor.innerHTML,
      } as IComment;
      if (!this.imageSrc()) comment.url = null; // no image chosen.
      this.subscribeToSaveResponse(
        this.commentService.update(comment, this.file)
      );
    } else {
      const comment = {
        post: { id: this.post.id },
        content: this.editor.innerHTML,
      } as IComment;
      this.subscribeToSaveResponse(
        this.commentService.create(comment, this.file)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<EntityResponseType>
  ): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: ({ body }) => {
        this.onSaveSuccess.emit(body);
        this.editor.innerHTML = ""; // reset the editor.
        this.remove();
      },
      error: () =>
        this.alertService.addAlert({
          type: "error",
          message: "Une error s'est produit lors de la sauvegarde.",
        }),
    });
  }

  handleImage(event) {
    this.file = event.target.files[0];
    if (this.file) {
      this.imageSrc.set(URL.createObjectURL(this.file));

      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   this.imageSrc.set(reader.result);
      //   console.log(reader.result);

      // };
      // reader.readAsDataURL(this.file);
    }
  }

  remove() {
    this.file = null;
    this.imageSrc.set(null);
  }
}
