import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPost } from 'app/entities/models/nk-post.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IFile } from './../../models/nk-file.model';
import { PostService } from './../nk-post.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';

import { Field, form, max, required } from '@angular/forms/signals';
import { AttachmentType } from 'app/entities/enumerations/attachment-type.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { AccountService } from 'app/entities/nk-account/nk-account.service';
import { AlertService } from 'app/shared/alert/alert.service';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { scaleInOut400ms } from 'app/shared/animations/scale-in-out.animation';
import { scaleInOutAnimation150ms } from 'app/shared/animations/stagger.animation';

@Component({
  standalone: true,
  selector: 'app-post-update',
  templateUrl: './nk-post-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, Field],
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
  protected deletedFiles: IFile[] = [];
  // protected files: IFile[] = [];
  account = inject(AccountService).trackCurrentAccount();

  expandedIndexes: Set<number> = new Set<number>();

  protected postModel = signal<IPost>({
    id: null,
    content: '',
    visibility: Visibility.PUBLIC,
    files: [],
  });

  protected postForm = form(this.postModel, (p) => {
    required(p.content, { message: 'Username is required' });
    max(p.content, 1000);
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.activatedRoute.data.subscribe(({ post }) => {
      if (post) {
        // this.post.set(post);
        // this.postForm().(this.post());
        // this.keywords = this.post()?.keywords.split(',') || [];
        // this.updatedFiles = this.post().files;
      }
    });
  }

  save(): void {
    this.isSaving.set(true);
    const post: IPost = this.postForm().value();
    const newMedias = post.files.filter((file) => file.id == null);
    post.files = [];
    const covers: IFile[] = []; // [TODO] handle cover images for videos.
    if (post.id !== null) {
      const deletedFiles = this.deletedFiles.map((file) => ({
        id: file.id,
        url: file.url,
      }));
      this.subscribeToSaveResponse(
        this.postService.update(post, deletedFiles, newMedias, deletedFiles)
      );
    } else {
      this.subscribeToSaveResponse(this.postService.create(post, newMedias, covers));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this.alertService.addAlert({
          type: 'success',
          message: 'Enregistrer avec succès!',
        });
        this.previousState();
      },
      error: () =>
        this.alertService.addAlert({
          type: 'error',
          message: "Une erreur s'est produite lors de l'enregistrement.",
        }),
    });
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

  isImage(file: IFile): boolean {
    return file.type.startsWith('image/');
  }

  isVideo(file: IFile): boolean {
    return file.type.startsWith('video/');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(2)} ${units[index]}`;
  }

  extention(file: IFile): string {
    return file.type.split('/').pop()?.toUpperCase();
  }

  filterFile(files: IFile[], type: string = ''): IFile[] {
    return files.filter((e) => e.type === type);
  }

  handleFile(event) {
    const obj: File = event.target.files[0];
    if (obj) {
      const file: IFile = { filename: obj.name, size: obj.size, type: obj.type, data: obj };
      if (this.isImage(file)) {
        file.url = URL.createObjectURL(obj);
      } else if (this.isVideo(file)) {
      }
      this.postModel().files.push(file);
      // this.files.push(file);
    }
  }

  remove(idx: number) {
    const file = this.postModel().files[idx];
    if (file.type == AttachmentType.IMAGE) {
      URL.revokeObjectURL(file.url);
    }
    this.postModel().files.splice(idx, 1);
    if (file.id) {
      this.deletedFiles.push(file);
    }
  }

  previousState(): void {
    window.history.back();
  }
}
