import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import * as dotenv from "dotenv";
import * as process from "node:process";
@Injectable()
export class InternalApiGuard implements  CanActivate{
  private readonly internalKey = process.env.INTERNAL_KEY || "api-key-for-internal-api" ;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const internalKey = request.headers['internal-auth-key'];
    if (!internalKey) {
      throw new BadRequestException("Missing required parameter 'internal-auth-key'");
    }

    if (internalKey !== this.internalKey){
      throw new BadRequestException("Missing required parameter 'internalKey'");
    }

    return true;
  }
}