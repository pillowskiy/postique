import { Transactional } from '@/app/boundaries/common';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { RequestScope } from 'nj-request-scope';

@Injectable()
@RequestScope()
export class MongoTransactional extends Transactional {
  private _session: ClientSession | null;

  constructor(@InjectConnection() private readonly connection: Connection) {
    super();
  }

  public async start() {
    if (this._session) {
      if (this._session.inTransaction()) {
        await this._session.abortTransaction();
        await this._session.endSession();
        throw new Error('Session already in transaction');
      }
      await this._session.endSession();
    }

    this._session = await this.connection.startSession();
    this._session.startTransaction({
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' },
      readPreference: 'primary',
      retryWrites: true,
    });
  }

  public async commit() {
    const session = this._forceSession();
    await session.commitTransaction();
    return void session.endSession();
  }

  public async rollback() {
    const session = this._forceSession();
    await session.abortTransaction();
    return void session.endSession();
  }

  public getSession<T extends null | undefined>(
    nullable: T,
  ): ClientSession | T {
    if (!this._session) {
      return nullable;
    }
    return this._session;
  }

  private _forceSession(): ClientSession {
    if (!this._session) {
      throw new Error('Session not started');
    }
    return this._session;
  }
}
