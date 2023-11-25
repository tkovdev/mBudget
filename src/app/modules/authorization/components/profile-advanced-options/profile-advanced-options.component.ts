import { Component } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FilesService} from "../../../../services/files.service";

@Component({
  selector: 'app-profile-advanced-options',
  templateUrl: './profile-advanced-options.component.html',
  styleUrls: ['./profile-advanced-options.component.scss']
})
export class ProfileAdvancedOptionsComponent {
  fileId: string;
  fileContent: string;

  constructor(private config: DynamicDialogConfig, private ref: DynamicDialogRef, private filesService: FilesService) {
    this.fileId = this.config.data.fileId;
    this.fileContent = this.config.data.fileContent;
  }

  saveFile(): void {
    this.filesService.saveFile(this.fileId, JSON.parse(this.fileContent)).subscribe(() => {
      this.ref.close();
    })
  }
}
