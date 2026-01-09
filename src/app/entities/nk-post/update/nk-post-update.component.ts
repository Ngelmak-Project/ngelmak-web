import { HttpResponse } from "@angular/common/http";
import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IPost } from "app/entities/models/nk-post.model";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { PostService } from "./../nk-post.service";

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import SharedModule from "app/shared/shared.module";

import { Status } from "app/entities/enumerations/status.model";
import { Visibility } from "app/entities/enumerations/visibility.model";
import { IFile } from "app/entities/models/nk-file.model";
import { AccountService } from "app/entities/nk-account/nk-account.service";
import { AlertService } from "app/shared/alert/alert.service";
import { fadeInUp400ms } from "app/shared/animations/fade-in-up.animation";
import { scaleInOut400ms } from "app/shared/animations/scale-in-out.animation";
import { scaleInOutAnimation150ms } from "app/shared/animations/stagger.animation";

@Component({
  standalone: true,
  selector: "app-post-update",
  templateUrl: "./nk-post-update.component.html",
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  animations: [fadeInUp400ms, scaleInOut400ms, scaleInOutAnimation150ms],

  encapsulation: ViewEncapsulation.None, // Disable encapsulation
})
export class PostUpdateComponent implements OnInit {
  // readonly dialog = inject(MatDialog);
  private postService = inject(PostService);
  private alertService = inject(AlertService);
  private activatedRoute = inject(ActivatedRoute);
  protected post = signal<IPost>(null);
  protected isSaving = signal(false);
  protected isLoading = signal(false);
  protected updatedFiles: IFile[] = [];
  protected deletedFiles: IFile[] = [];
  protected visibilityValues = Object.keys(Visibility);
  protected statusValues = Object.keys(Status);
  protected keywords: string[] = [];
  account = inject(AccountService).trackCurrentAccount();

  expandedIndexes: Set<number> = new Set<number>();

  postForm = new FormGroup({
    id: new FormControl(null),
    title: new FormControl(null, [Validators.required]),
    subtitle: new FormControl(null),
    keywords: new FormControl(null),
    subject: new FormControl(null, [Validators.required]),
    at: new FormControl(null),
    lastUpdate: new FormControl(null),
    visibility: new FormControl(null),
    content: new FormControl(null, [
      Validators.required,
      Validators.maxLength(1000),
    ]),
    status: new FormControl(null),
    account: new FormControl(null),
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.activatedRoute.data.subscribe(({ post }) => {
      this.post.set(post);
      this.postForm.patchValue(this.post());
      this.keywords = this.post()?.keywords.split(",") || [];
      this.updatedFiles = this.post().files;
    });
  }

  save(): void {
    this.isSaving.set(true);
    const keywords = this.keywords.reduce(
      (prev: string, curr: string) => `${prev},${curr}`
    );
    const post: IPost = { ...this.postForm.value, keywords };
    const newFiles = this.updatedFiles.filter((el) => {
      if (el.id) {
        const find = this.post().files.find((item) => item.id == el.id);
        return find.position != el.position || find.dirty;
      }
      return true;
    });
    if (post.id !== null) {
      const deletedFiles = this.deletedFiles.map((el) => ({
        id: el.id,
        url: el.url,
        posterUrl: el.posterUrl,
      }));
      this.subscribeToSaveResponse(
        this.postService.update(post, newFiles, deletedFiles)
      );
    } else {
      this.subscribeToSaveResponse(this.postService.create(post, newFiles));
    }
  }

  private subscribeToSaveResponse(
    result: Observable<HttpResponse<IPost>>
  ): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this.alertService.addAlert({
          type: "success",
          message: "Enregistrer avec succès!",
        });
        this.previousState();
      },
      error: () =>
        this.alertService.addAlert({
          type: "error",
          message: "Une erreur s'est produite lors de l'enregistrement.",
        }),
    });
  }

  protected addkeyword(event) {
    const keyword = (event.value || "").trim();
    if (keyword.length > 0) {
      this.keywords.push("#" + keyword);
    }
  }

  protected removekeyword(i: number) {
    this.keywords = this.keywords.filter((value, idx) => idx != i);
  }

  openFileTextDialog(position?: number): void {
    // const dialogRef = this.dialog.open(FileTextDialogComponent, {
    //   disableClose: true,
    //   width: "90vw",
    //   maxWidth: "100vw",
    //   maxHeight: "90vw",
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });
    // const idx = this.updatedFiles.findIndex((e) => e.position == position);
    // if (idx > -1) {
    //   dialogRef.componentInstance.textContent =
    //     this.updatedFiles[idx].textContent;
    // }
    // dialogRef
    //   .afterClosed()
    //   .subscribe((file: IFile) => this.afterClosed(position, file));
  }

  openFileVoiceRecoder(position?: number): void {
    // const dialogRef = this.dialog.open(FileVoiceRecoderComponent, {
    //   disableClose: true,
    //   width: "500px",
    //   height: "350px",
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });

    // dialogRef
    //   .afterClosed()
    //   .subscribe((file: IFile) => this.afterClosed(position, file));
  }

  openFileVideo(position?: number): void {
    // const dialogRef = this.dialog.open(FileVideoComponent, {
    //   disableClose: true,
    //   width: "500px",
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });
    // const idx = this.updatedFiles.findIndex((e) => e.position == position);
    // if (idx > -1) {
    //   dialogRef.componentInstance.file.set(this.updatedFiles[idx]);
    // }
    // dialogRef
    //   .afterClosed()
    //   .subscribe((file) => this.afterClosed(position, file));
  }

  openFileImage(position?: number): void {
    // const dialogRef = this.dialog.open(FileImageComponent, {
    //   disableClose: true,
    //   width: "500px",
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });
    // const idx = this.updatedFiles.findIndex((e) => e.position == position);
    // if (idx > -1) {
    //   dialogRef.componentInstance.file.set(this.updatedFiles[idx]);
    // }
    // dialogRef
    //   .afterClosed()
    //   .subscribe((file) => this.afterClosed(position, file));
  }

  openFileFileInput(position?: number): void {
    // const dialogRef = this.dialog.open(FileInputComponent, {
    //   disableClose: true,
    //   width: "500px",
    //   enterAnimationDuration: "300ms",
    //   exitAnimationDuration: "150ms",
    // });

    // dialogRef
    //   .afterClosed()
    //   .subscribe((file: IFile) => this.afterClosed(position, file));
  }

  private afterClosed(position?: number, file?: IFile) {
    if (file) {
      if (position) {
        this.replace(position, file);
      } else {
        this.append(file);
      }
    }
  }

  remove(file: IFile) {
    if (file.id) {
      this.deletedFiles.push(file);
    }
    this.updatedFiles = this.updatedFiles.filter(
      (e) => e.position != file.position
    );
  }

  /**
   * Add a new File to the list.
   *
   * @param file
   * @param file video, image or ducument file.
   * @param poster is used for an file type video.
   */
  append(file: IFile) {
    const positions = this.updatedFiles.map((e) => e.position);
    file.position = Math.max(...positions, 1) + 1;
    this.updatedFiles.push(file);
  }

  /**
   * Replace an existing file with the given on.
   *
   * @param position
   * @param file
   * @param file
   * @param poster
   */
  replace(position: number, file: IFile) {
    const idx = this.updatedFiles.findIndex((e) => e.position == position);
    const existsAttachement = this.updatedFiles[idx];
    if (existsAttachement.id) {
      this.deletedFiles.push(existsAttachement);
    }
    file.position = position; // update file's position.
    this.updatedFiles[idx] = file; // now replace the former file with the new one.
    this.updatedFiles[idx].dirty = true;
  }

  protected moveup(file: IFile) {
    this.updatedFiles = this.updatedFiles.sort((e) => e.position);
    const idx = this.updatedFiles.findIndex((e) => e.position == file.position);
    const switch_with_idx: number =
      idx > 0 ? idx - 1 : this.updatedFiles.length - 1;
    const tmp: IFile = this.updatedFiles[idx];
    this.updatedFiles[idx] = this.updatedFiles[switch_with_idx];
    this.updatedFiles[switch_with_idx] = tmp;
    this.updatedFiles = this.updatedFiles.map((element, i) => {
      element.position = i + 1;
      return element;
    });
  }

  protected movedown(file: IFile) {
    this.updatedFiles = this.updatedFiles.sort((e) => e.position);
    const idx = this.updatedFiles.findIndex((e) => e.position == file.position);
    const switch_with_idx: number =
      idx < this.updatedFiles.length - 1 ? idx + 1 : 0;
    const tmp: IFile = this.updatedFiles[idx];
    this.updatedFiles[idx] = this.updatedFiles[switch_with_idx];
    this.updatedFiles[switch_with_idx] = tmp;
    this.updatedFiles = this.updatedFiles.map((element, i) => {
      element.position = i + 1;
      return element;
    });
  }

  toggleExpand(idx: number) {
    if (this.expandedIndexes.has(idx)) {
      this.expandedIndexes.delete(idx);
    } else {
      this.expandedIndexes.add(idx);
    }
  }

  isExpanded(idx: number): boolean {
    return this.expandedIndexes.has(idx);
  }

  filterFile(files: IFile[], type: string = ""): IFile[] {
    return files.filter((e) => e.type === type);
  }

  previousState(): void {
    window.history.back();
  }
}
