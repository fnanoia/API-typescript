import { IRolesDocument } from "../database/models/roles.model";
import { IReviewDocument } from "../database/models/review.model";

export interface IUser {
  username: string;
  birthdate: Date;
  img: string;
  social: string;
  email: string;
  password: string;
  role: IRolesDocument["_id"];
  review: IReviewDocument["_id"];
}
