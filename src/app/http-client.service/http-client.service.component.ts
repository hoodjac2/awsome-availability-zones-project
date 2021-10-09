import { DynamoDB, Config} from 'aws-sdk';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpClientServiceComponent {

  public getFromDB(): void{

    const config = new Config();
    config.update({
      region: "us-east-2",
      endpoint: "http://localhost:8001",
      // accessKeyId default can be used while using the downloadable version of DynamoDB.
      // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
      accessKeyId: "fakeMyKeyId",
      // secretAccessKey default can be used while using the downloadable version of DynamoDB.
      // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
      secretAccessKey: "fakeSecretAccessKey"
    }, true);

    const docClient = new DynamoDB.DocumentClient(config);

    const table = "Test";

    const latency = 11;
    const region = "us-east-1";

    const params = {
        TableName: table,
        Key:{
            "Region": region,
            "Latency": latency
        }
    };

    docClient.get(params, function(err: any, data: any) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
      }


}
