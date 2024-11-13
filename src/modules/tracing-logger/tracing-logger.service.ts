import { Injectable, Logger, Scope } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

@Injectable({scope: Scope.TRANSIENT})
export class TracingLogger extends Logger{
    constructor(private readonly als: AsyncLocalStorage<any>) {
        super()
    }

    protected options: { timestamp?: boolean };

    setContext(context: string){
        this.context = context
    }

    getMessage(message:string){
        const traceId = this.als?.getStore().traceId;
        return `${traceId} - ${message}`;
    }

    debug(message: any, context?: string): void {
        super.debug(this.getMessage(message));
    }

    error(message: any, stack?: string, context?: string): void{
        super.error(this.getMessage(message));
    }

    fatal(message: any, context?: string): void {
        super.fatal(this.getMessage(message));
    }

    log(message: any, context?: string): void{
        super.log(this.getMessage(message));
    }

    verbose(message: any, context?: string): void {
        super.verbose(this.getMessage(message));
    }

    warn(message: any, context?: string) {
        super.warn(this.getMessage(message));
    }

}