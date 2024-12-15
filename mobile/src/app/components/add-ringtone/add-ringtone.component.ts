import { Component, OnInit } from '@angular/core';
import { RingtoneService } from 'src/app/services/ringtone.service';

@Component({
  selector: 'app-add-ringtone',
  templateUrl: './add-ringtone.component.html',
  styleUrls: ['./add-ringtone.component.scss'],
})
export class AddRingtoneComponent implements OnInit{
  selectedFile: File | null = null;
  selectedFileName: string = '';
  uploadMessage: string = '';
  messageType: 'success' | 'error' | '' = '';
  isLoading: boolean = false;

  constructor(private ringtoneService: RingtoneService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      console.log('Selected file:', this.selectedFile);
    } else {
      this.uploadMessage = 'Veuillez sélectionner un fichier audio';
      this.messageType = 'error';
    }
  }

  uploadRingtone() {
    if (this.selectedFile) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.ringtoneService.uploadRingtone(formData).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          this.uploadMessage = 'Sonnerie correctement ajoutée';
          this.messageType = 'success';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Upload failed', error);
          if (error.status === 409) {
            this.uploadMessage = 'Erreur : cette sonnerie a déjà été ajoutée';
            this.messageType = 'error';
            this.isLoading = false;
          } else {
            this.uploadMessage = 'Erreur lors de l\'ajout de la sonnerie';
            this.messageType = 'error';
            this.isLoading = false;
          }
        }
      });
    } else {
      console.error('No file selected');
      this.uploadMessage = 'Aucun fichier sélectionné';
      this.messageType = 'error';
    }
  }

  ngOnInit() {}
}