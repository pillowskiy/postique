import { Transactional } from '@/app/boundaries/common';
import { Injectable } from '@nestjs/common';
import { RequestScope } from 'nj-request-scope';
import { InjectConnection } from './drizzle.decorator';
import { DrizzleConnection, DrizzleTransaction } from './drizzle.connection';

@Injectable()
@RequestScope()
export class DrizzleTransactional extends Transactional {
  private _tx: DrizzleTransaction | null = null;

  @InjectConnection()
  private readonly _connection: DrizzleConnection;

  public async start() {
    const tx = await this._connection.begin();
    this._tx = tx;
  }

  public async commit() {
    if (this._tx) {
      await this._tx.txCommit();
    }
  }

  public async rollback() {
    if (this._tx) {
      await this._tx.txRollback();
    }
  }

  public get exec(): DrizzleConnection | DrizzleTransaction {
    return this._tx ?? this._connection;
  }
}
