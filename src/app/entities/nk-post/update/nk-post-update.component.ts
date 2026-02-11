import { HttpResponse } from '@angular/common/http';
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFile } from 'app/entities/models/nk-file.model';
import { IPost, IPostDTO } from 'app/entities/models/nk-post.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PostService } from './../nk-post.service';

import SharedModule from 'app/shared/shared.module';

import { Field, form, maxLength, required } from '@angular/forms/signals';
import { AttachmentType } from 'app/entities/enumerations/attachment-type.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { AlertService } from 'app/shared/alert/alert.service';

const initPost: IPost = {
  id: null,
  content: '',
  visibility: Visibility.PUBLIC,
  files: [],
};

@Component({
  standalone: true,
  selector: 'app-post-update',
  templateUrl: './nk-post-update.component.html',
  imports: [SharedModule, Field],

  encapsulation: ViewEncapsulation.None, // Disable encapsulation
})
export class PostUpdateComponent {
  post = input<IPost | IPostDTO>(); // The post to edit, provided as an input property.
  onsaved = output<IPostDTO>(); // Event emitted when the post is successfully saved.
  oncancel = output<void>(); // Event emitted when the user cancels the edit operation.
  protected postSig = signal<IPostDTO>(null);

  // readonly dialog = inject(MatDialog);
  private postService = inject(PostService);
  private alertService = inject(AlertService);
  protected isSaving = signal(false);
  protected deletedFiles: IFile[] = [];
  // protected files: IFile[] = [];
  channel = inject(ChannelService).channel;
  expandedIndexes: Set<number> = new Set<number>();

  protected postModel = signal<IPost>(initPost);

  protected postForm = form(this.postModel, (p) => {
    required(p.content, { message: 'Le contenu de la publication est obligatoire.' });
    maxLength(p.content, 3000, { message: 'Le contenu ne doit pas dépasser 1000 caractères.' });
  });

  constructor() {
    effect(() => {
      const post = this.post();
      if (post) {
        this.postModel.update(() => ({
          id: post.id,
          content: post.content,
          visibility: post.visibility,
          files: post.files || [],
        }));
      }
    });
  }

  save(): void {
    this.isSaving.set(true);
    const post: IPost = this.postModel();
    post.content = post.content.trim();
    const newMedias = post.files.filter((file) => file.id == null);
    post.files = [];
    const covers = newMedias.map((media) => media.cover);
    if (post.id !== null) {
      const deletedFiles = this.deletedFiles.map((file) => ({
        id: file.id,
        url: file.url,
      }));
      this.subscribeToSaveResponse(
        this.postService.update(post, deletedFiles, newMedias, deletedFiles),
      );
    } else {
      this.subscribeToSaveResponse(this.postService.create(post, newMedias, covers));
    }
  }

  private subscribeToSaveResponse(result): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: (res) => {
        this.alertService.addAlert({
          type: 'success',
          translationKey: 'ngelmakApp.post.created',
          message: 'Publié avec succès.',
        });
        this.postForm().reset({ ...initPost, files: [] }); // reset post values.
        this.onsaved.emit(res.body);
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
}
