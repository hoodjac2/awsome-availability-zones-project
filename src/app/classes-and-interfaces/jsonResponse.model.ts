import { AZDataResponse } from "./az.model";

export interface JsonResponseModel {
  Count: number,
  Items: AZDataResponse[],
  ScannedCount: number
}
