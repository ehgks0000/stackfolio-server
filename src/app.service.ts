import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class AppService {
  getHello(req): string {
    return `hello nest , ${os.hostname()}`;
  }
}
