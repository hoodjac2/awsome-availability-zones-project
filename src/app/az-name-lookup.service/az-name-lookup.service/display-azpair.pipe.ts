import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'displayAZPair' })
export class DisplayAZPairPipe implements PipeTransform{
  transform(AZPair: string): string{
    const array = AZPair.split(',');
    const az1 = this.decryptAZName(array[0]);
    const az2 = this.decryptAZName(array[1]);
    return az1 + ' => ' + az2;
  }

  private decryptAZName(AzName: string): string {
    const arrayName = AzName.split('-')[0];
    switch(arrayName) {
      case "afs1":
        return AzName + ' (Cape Town)';
        break;
      case "apne1":
        return AzName + ' (Tokyo)';
        break;
      case "apne2":
        return AzName + ' (Seoul)';
        break;
      case "apne3":
        return AzName + ' (Osaka)';
        break;
      case "apse1":
        return AzName + ' (Singapore)';
        break;
      case "apse2":
        return AzName + ' (Sydney)';
        break;
      case "aps1":
        return AzName + ' (Mumbai)';
        break;
      case "eun1":
        return AzName + ' (Stockholm)';
        break;
      case "eus1":
        return AzName + ' (Milan)';
        break;
      case "euw1":
        return AzName + ' (Ireland)';
        break;
      case "euw2":
        return AzName + ' (London)';
        break;
      case "euw3":
        return AzName + ' (Paris)';
        break;
      case "euc1":
        return AzName + ' (Frankfurt)';
        break;
      case "sae1":
        return AzName + ' (São Paulo)';
        break;
      case "use1":
        return AzName + ' (Virginia)';
        break;
      case "usw1":
        return AzName + ' (Northern California)';
        break;
      case "usw2":
        return AzName + ' (Oregon)';
        break;
      case "use2":
        return AzName + ' (Ohio)';
        break;
      case "cac1":
        return AzName + ' (Canada)';
        break;
    }
    return '';
  }
}
