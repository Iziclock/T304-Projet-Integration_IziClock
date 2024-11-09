import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RingtoneService } from 'src/app/services/ringtone.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-ringtone',
  templateUrl: './add-ringtone.component.html',
  styleUrls: ['./add-ringtone.component.scss'],
})
export class AddRingtoneComponent {
  selectedFile: File | null = null;
  selectedFileName: string = '';
  uploadMessage: string = '';

  constructor(private ringtoneService: RingtoneService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;
    console.log('Selected file:', this.selectedFile);
  }

  uploadRingtone() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.ringtoneService.uploadRingtone(formData).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          this.uploadMessage = 'Sonnerie correctement ajoutée';
        },
        error: (error) => {
          console.error('Upload failed', error);
          if (error.status === 409) {
            this.uploadMessage = 'Erreur : cette sonnerie a déjà été ajoutée';
          } else {
            this.uploadMessage = 'Erreur lors de l\'ajout de la sonnerie';
          }
        }
      });
      this.uploadMessage = 'Sonnerie correctement ajoutée';
    } else {
      console.error('No file selected');
      this.uploadMessage = 'Aucun fichier sélectionné';
    }
  }
}