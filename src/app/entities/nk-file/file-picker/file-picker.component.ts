import {
  Component,
  inject,
  input,
  output,
  signal,
  ViewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { AlertService } from 'app/shared/alert/alert.service';
import { IFile } from 'app/entities/models/nk-file.model';

type FileCategory = 'image' | 'pdf' | 'video' | 'audio' | 'document';

@Component({
  standalone: true,
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  imports: [CommonModule],
})
export class FilePickerComponent {
  private alertService = inject(AlertService);

  @ViewChild('fileInput', { static: true })
  fileInput!: ElementRef<HTMLInputElement>;

  allowMultiple = input<boolean>(false);
  maxFileSizeBytes = input<number | null>(null);
  fileCategories = input<FileCategory[]>(['image']);
  isDisabled = input<boolean>(false);

  filesSelected = output<IFile[]>();

  isLoading = signal(false);
  acceptedFileTypes = this.buildAcceptedTypes();
  totalSize = 0;

  constructor() {
    effect(() => {
      this.acceptedFileTypes = this.buildAcceptedTypes();
    });
  }

  async selectFiles(): Promise<void> {
    if (this.isDisabled() || this.isLoading()) return;

    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      await this.selectFilesNative();
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  private async selectFilesNative(): Promise<void> {
    try {
      this.isLoading.set(true);

      const result = await FilePicker.pickFiles({
        types: this.getMimeTypes(),
        limit: this.allowMultiple() ? 0 : 1,
        readData: true,
      });

      const processed = await this.processFiles(result.files);
      this.filesSelected.emit(processed);
    } catch (err) {
      this.alertService.addAlert({
        type: 'error',
        translationKey: 'ngelmakTranslation.entities.file.filePicker.alerts.genericError',
        message: 'Erreur lors de la sélection du fichier.',
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    this.isLoading.set(true);

    const processed = await this.processFiles(Array.from(files));
    this.filesSelected.emit(processed);

    input.value = '';
    this.isLoading.set(false);
  }

  private async processFiles(files: any[]): Promise<IFile[]> {
    const processed: IFile[] = [];

    for (const file of files) {
      const normalized = await this.normalizeFile(file);

      // Vérification taille totale
      if (this.maxFileSizeBytes()) {
        if (this.totalSize + normalized.size > this.maxFileSizeBytes()!) {
          this.alertService.addAlert({
            type: 'warning',
            translationKey: 'ngelmakTranslation.entities.file.filePicker.alerts.totalSizeExceeded',
            message: 'La taille totale des fichiers dépasse la limite autorisée.',
          });
          continue;
        }
      }

      const validated = await this.validateFile(normalized);

      if (validated) {
        processed.push(validated);
        this.totalSize += validated.size;
      }
    }

    return processed;
  }

  private async normalizeFile(file: any): Promise<File> {
    if (file.data && typeof file.data === 'string') {
      const blob = this.base64ToBlob(file.data, file.mimeType);
      return new File([blob], file.name, { type: file.mimeType });
    }

    return file;
  }

  private async validateFile(file: File): Promise<IFile | null> {
    const { name, size, type } = file;

    // Prevent empty files
    if (file.size === 0) {
      this.alertService.addAlert({
        type: 'warning',
        translationKey: 'ngelmakTranslation.entities.file.filePicker.alerts.emptyFile',
        message: 'Ce fichier est vide et ne peut pas être ajouté.',
      });
      return null;
    }

    // Individual size check
    if (this.maxFileSizeBytes() && size > this.maxFileSizeBytes()!) {
      this.alertService.addAlert({
        type: 'warning',
        translationKey: 'ngelmakTranslation.entities.file.filePicker.alerts.fileTooLarge',
        message: 'Ce fichier dépasse la taille maximale autorisée.',
      });
      return null;
    }

    // Block videos
    if (type.startsWith('video/')) {
      this.alertService.addAlert({
        type: 'warning',
        translationKey: 'ngelmakTranslation.entities.file.filePicker.alerts.videoNotSupported',
        message: 'Vidéo non prise en charge pour le moment.',
      });
      return null;
    }

    // Unsupported type
    if (!this.isValidFileType(type, name)) {
      this.alertService.addAlert({
        type: 'warning',
        translationKey: 'ngelmakTranslation.entities.file.filePicker.alerts.invalidType',
        message: "Ce type de fichier n'est pas autorisé.",
      });
      return null;
    }

    const selected: IFile = {
      filename: name,
      size,
      type,
      data: file,
    };

    if (type.startsWith('image/')) {
      selected.url = URL.createObjectURL(file);
    }

    return selected;
  }

  private base64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([new Uint8Array(byteNumbers)], { type: mime });
  }

  private buildAcceptedTypes(): string {
    const map: Record<FileCategory, string[]> = {
      image: ['image/*'],
      pdf: ['application/pdf'],
      video: ['video/*'],
      audio: ['audio/*'],
      document: ['text/*', 'application/*'],
    };

    return this.fileCategories()
      .flatMap((cat) => map[cat])
      .join(', ');
  }

  private getMimeTypes(): string[] {
    const map: Record<FileCategory, string[]> = {
      image: ['image/*'],
      pdf: ['application/pdf'],
      video: ['video/*'],
      audio: ['audio/*'],
      document: ['text/*', 'application/*'],
    };

    return this.fileCategories().flatMap((cat) => map[cat]);
  }

  private isValidFileType(mime: string, filename: string): boolean {
    const cats = this.fileCategories();

    if (cats.includes('image') && mime.startsWith('image/')) return true;
    if (cats.includes('pdf') && mime === 'application/pdf') return true;
    if (cats.includes('video') && mime.startsWith('video/')) return true;
    if (cats.includes('audio') && mime.startsWith('audio/')) return true;

    if (cats.includes('document')) {
      const ext = filename.toLowerCase();
      return ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'].some((e) => ext.endsWith(e));
    }

    return false;
  }
}
