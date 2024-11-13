import {Inject, Injectable, NestMiddleware} from "@nestjs/common";
import {AsyncLocalStorage} from "async_hooks";
import { v4 as uuidV4 } from 'uuid';

export const randomUuid = ()=> uuidV4()
@Injectable()
export class TracingLoggerMiddleware implements NestMiddleware{
    constructor(@Inject(AsyncLocalStorage) private readonly storage: AsyncLocalStorage<{ traceId: string }>) {}

    use(req: any, res: any, next: (error?: any) => void): any {
        const traceId : string = randomUuid();
        const store = { traceId };
        res.setHeader('trac-id', traceId);
        this.storage.run(store, ()=> next())
    }
}