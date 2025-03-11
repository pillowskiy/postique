import { Injectable, Scope } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class DbContext {
  private session: ClientSession;

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async start() {
    this.session = await this.connection.startSession();
    this.session.startTransaction();
  }

  async commit() {
    await this.session.commitTransaction();
    this.session.endSession();
  }

  async rollback() {
    await this.session.abortTransaction();
    this.session.endSession();
  }
}
