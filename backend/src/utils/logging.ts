import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const now = Date.now();
    let isFinished = false;

    response.on('close', () => {
      if (!isFinished) {
        this.logger.error(`${request.url} ${request.ip} closed prematurely. `);
      }
    });

    response.on('finish', () => {
      isFinished = true;
      const time = Date.now() - now;

      const logLevel =
        response.statusCode >= 500
          ? 'error'
          : response.statusCode >= 400
          ? 'warn'
          : 'log';

      this.logger[logLevel](
        `${response.statusCode} ${request.method} ${request.url} ${
          response.req.user?.email ?? '?'
        } ${time}ms`,
      );
    });

    next();
  }
}
