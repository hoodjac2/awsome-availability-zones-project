import { Component, Input } from "@angular/core";

export interface awsInfoElement {
  name: string;
  latency: string;
  date: string;
}

@Component({
  selector: 'upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent {
  title = 'capstone-test';
  dataSource: awsInfoElement[] = [];
  displayedColumns: string[] = ['name', 'latency', 'date'];


  public uploadData(event: any): void {
    const files = event.target!.files;
    if (files.length >0) {
      console.log(files[0].name)
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        this.ArrayifyCSV(csv);
        console.log(this.dataSource);
     }
    }
  }
  private ArrayifyCSV(csv: string) : void{
    let array = csv.split(',');
    const test: awsInfoElement = {
      name:array[0],
      latency:array[1],
      date:array[2]
    }
    this.dataSource = [test];
  }
}
