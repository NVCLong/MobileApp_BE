import {Global, Module} from "@nestjs/common";
import { AsyncLocalStorage } from 'async_hooks';
import {TracingLogger} from "./tracing-logger.service";
import { TracingLoggerMiddleware } from "./tracing-logger.middleware";

@Global()
@Module({
    providers: [
        TracingLogger,
        {
            provide: AsyncLocalStorage,
            useValue: new AsyncLocalStorage(),
        },
    ],
    exports: [TracingLogger, AsyncLocalStorage],
})
export class TracingLoggerModule {}