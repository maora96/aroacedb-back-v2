import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangePermissionDTO {
  @IsBoolean()
  @IsNotEmpty({ message: "status can't be empty" })
  status: boolean;
}
