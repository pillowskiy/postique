import { Transactional } from '@/app/boundaries/common';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { RequestScope } from 'nj-request-scope';

@Injectable()
@RequestScope()
export class MongoTransactional extends Transactional {
  private session: ClientSession | null;

  constructor(@InjectConnection() private readonly connection: Connection) {
    super();
  }

  public async start() {
    if (this.session) {
      if (this.session.inTransaction()) {
        await this.session.abortTransaction();
        await this.session.endSession();
        throw new Error('Session already in transaction');
      }
      await this.session.endSession();
    }

    this.session = await this.connection.startSession();
    this.session.startTransaction({
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' },
      readPreference: 'primary',
      retryWrites: true,
    });
  }

  public async commit() {
    const session = this.getSession();
    await session.commitTransaction();
    return void session.endSession();
  }

  public async rollback() {
    const session = this.getSession();
    await session.abortTransaction();
    return void session.endSession();
  }

  private getSession(): ClientSession {
    if (!this.session) {
      throw new Error('Session not started');
    }
    return this.session;
  }
}
