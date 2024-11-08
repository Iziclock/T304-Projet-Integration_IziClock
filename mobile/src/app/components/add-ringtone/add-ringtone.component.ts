import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-ringtone',
  templateUrl: './add-ringtone.component.html',
  styleUrls: ['./add-ringtone.component.scss'],
})
export class AddRingtoneComponent {
  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;
    console.log('Selected file:', this.selectedFile);
  }

  uploadRingtone() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.http.post(`${environment.api}/ringtones/upload`, formData).subscribe({
        next: (response) => console.log('Upload successful', response),
        error: (error) => console.error('Upload failed', error)
      });
    } else {
      console.error('No file selected');
    }
  }
}