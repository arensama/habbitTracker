import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

export interface JwtPayloadDto extends Request {
  sub: string;
  username: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayloadDto;
}
