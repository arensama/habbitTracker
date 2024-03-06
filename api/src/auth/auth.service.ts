import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,

    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    // try {
    // Find the user by username
    const user = await this.userService.findOneByUsernameOrCreate(
      username,
      password,
    );
    console.log();

    // Check user credentials
    await this.userService.MatchUserCredentials(user, password);
    const payload = { sub: user._id, username: user.username };
    // return true;
    return {
      id: user._id,
      username,
      name: user.name,
      access_token: await this.jwtService.signAsync(payload),
    };

    // Return the token or perform other actions as needed
    // } catch (error) {
    //   // Handle the exception thrown by MatchUserCredentials
    //   console.error(error.message);
    //   // You might want to throw a different exception, log the error, or handle it in some way
    //   throw new UnauthorizedException('Authentication failed');
    // }
  }
}
