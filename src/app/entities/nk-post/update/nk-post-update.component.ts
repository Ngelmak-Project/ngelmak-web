import { Component, effect, inject, input, output, signal, ViewEncapsulation } from '@angular/core';
import { Field, form, maxLength, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { AttachmentType } from 'app/entities/enumerations/attachment-type.model';
import { IFile } from 'app/entities/models/nk-file.model';
import { IPost, IPostDTO } from 'app/entities/models/nk-post.model';
import { ChannelService } from 'app/entities/nk-channel/nk-channel.service';
import { AlertService } from 'app/shared/alert/alert.service';
import SharedModule from 'app/shared/shared.module';
import { finalize } from 'rxjs/operators';
import { PostService } from './../nk-post.service';

const initPost: IPost = {
  id: null,
  content: '',
  visible: true,
  files: [],
};

@Component({
  standalone: true,
  selector: 'app-post-update',
  templateUrl: './nk-post-update.component.html',
  imports: [RouterModule, Field, SharedModule],
  encapsulation: ViewEncapsulation.None, // Disable encapsulation
})
export class PostUpdateComponent {
  post = input<IPost | IPostDTO>(); // The post to edit, provided as an input property.
  postReply = input<IPostDTO>(null); // The post this post is replying to, if any (used for context in replies)
  onsaved = output<IPostDTO>(); // Event emitted when the post is successfully saved.
  oncancel = output<void>(); // Event emitted when the user cancels the edit operation.
  protected postSig = signal<IPostDTO>(null);

  // readonly dialog = inject(MatDialog);
  private postService = inject(PostService);
  private alertService = inject(AlertService);
  protected isSaving = signal(false);
  protected deletedFiles: IFile[] = [];
  activeChannel = inject(ChannelService).channel;
  expandedIndexes: Set<number> = new Set<number>();

  protected postModel = signal<IPost>(initPost);

  protected postForm = form(this.postModel, (p) => {
    required(p.content, { message: 'ngelmakTranslation.entities.post.update.content.required' });
    maxLength(p.content, 10000, {
      message: 'ngelmakTranslation.entities.post.update.content.maxLength',
    });
  });

  constructor() {
    effect(() => {
      const post = this.post();
      if (post) {
        this.postModel.update(() => ({
          id: post.id,
          content: post.content,
          visible: post.visible,
          files: post.files || [],
        }));
      }
    });
  }

  save(): void {
    this.isSaving.set(true);
    const post: IPost = { ...this.postModel() }; // Create a copy of the post model to modify before sending to backend
    if (this.postReply()) {
      post.postReply = { id: this.postReply().id } as IPost; // Only ID is needed for postReply when sending to backend
    }

    post.content = post.content.trim();
    const newMedias = post.files.filter((file) => file.id == null);
    post.files = [];
    const covers = newMedias.map((media) => media.cover);

    if (post.id !== null) {
      const deletedFiles = this.deletedFiles.map((file) => ({
        id: file.id,
        url: file.url,
      }));

      this.subscribeToSaveResponse(this.postService.update(post, deletedFiles, newMedias, covers));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post, newMedias, covers));
    }
  }

  private subscribeToSaveResponse(result): void {
    result.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: (res) => {
        this.alertService.addAlert({
          type: 'success',
          translationKey: this.post()?.id
            ? 'ngelmakTranslation.entities.post.update.alerts.updated'
            : 'ngelmakTranslation.entities.post.update.alerts.created',
          message: 'Publié avec succès.',
        });
        this.postForm().reset({ ...initPost, files: [] }); // reset post values.
        this.onsaved.emit(res.body);
      },
      error: () =>
        this.alertService.addAlert({
          type: 'error',
          translationKey: 'ngelmakTranslation.entities.post.update.alerts.error',
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

  /**
   * Handles a file selected by the user.
   * Creates an IFile object, generates a preview URL for images,
   * warns the user if the file is a video, and stores the file in the post model.
   */
  handleFile(event): void {
    // Extract the first selected file
    const obj: File = event.target.files[0];

    if (obj) {
      // Build the internal file representation
      const file: IFile = {
        filename: obj.name,
        size: obj.size,
        type: obj.type,
        data: obj,
      };

      if (this.isImage(file)) {
        // Generate a preview URL for images
        file.url = URL.createObjectURL(obj);
      } else if (this.isVideo(file)) {
        // Notify user that videos are not supported yet
        this.alertService.addAlert({
          type: 'info',
          translationKey: 'ngelmakTranslation.entities.post.update.alerts.videoNotSupported',
          message: 'Les médias vidéos ne sont pas encore prise en charge.',
        });
      } else {
        // Nothing need to be done for other media files.
      }

      // Add the file to the post model
      this.postModel().files.push(file);
    }
  }

  remove(idx: number): void {
    const file = this.postModel().files[idx];
    if (file.type == AttachmentType.IMAGE) {
      URL.revokeObjectURL(file.url);
    }
    this.postModel().files.splice(idx, 1);
    if (file.id) {
      this.deletedFiles.push(file);
    }
  }

  toggleVisibility(): void {
    this.postModel.update((value) => ({ ...value, visible: !this.postModel().visible }));
  }

  /**
   * Returns the placeholder text for the content textarea based on the current state.
   */
  get contentPlaceholder(): string {
    if (this.post()?.id)
      return 'ngelmakTranslation.entities.post.update.content.onUpdatePlaceholder';
    if (this.postReply())
      return 'ngelmakTranslation.entities.post.update.content.onReplyPlaceholder';
    return 'ngelmakTranslation.entities.post.update.content.placeholder';
  }
}
