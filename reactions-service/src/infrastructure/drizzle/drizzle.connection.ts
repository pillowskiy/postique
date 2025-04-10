import { Pool } from 'pg';
import * as schemas from './schemas';
import {
  drizzle,
  NodePgDatabase,
  NodePgSession,
  NodePgSessionOptions,
  NodePgTransaction,
} from 'drizzle-orm/node-postgres';
import { RelationalSchemaConfig, sql } from 'drizzle-orm';
import { PgDialect, PgSession } from 'drizzle-orm/pg-core';

export class DrizzleTransaction extends NodePgTransaction<typeof schemas, any> {
  async txStart(): Promise<void> {
    // Ref: https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/node-postgres/session.ts#L231
    await this.execute(
      //sql`begin${config ? sql` ${tx.getTransactionConfigSQL(config)}` : undefined}`,
      sql`begin${undefined}`,
    );
  }

  async txCommit(): Promise<void> {
    await this.execute(sql`commit`);
  }

  async txRollback(): Promise<void> {
    await this.execute(sql`rollback`);
  }
}

export abstract class DrizzleConnection<
    T extends typeof schemas = typeof schemas,
  >
  extends NodePgDatabase<T>
  implements ReturnType<typeof drizzle<T>>
{
  $client: Pool;

  /** @internal */
  dialect: PgDialect;
  /** @internal */
  session: PgSession<any, any, any>;
  /** @internal */
  schema: RelationalSchemaConfig<any> | undefined;

  /** @internal */
  options: NodePgSessionOptions | undefined;

  async begin(): Promise<DrizzleTransaction> {
    const session = new NodePgSession(
      await this.$client.connect(),
      this.dialect,
      this.schema,
      this.options,
    );
    const tx = new DrizzleTransaction(this.dialect, session, this.schema);
    await tx.txStart();
    return tx;
  }
}

export class DrizzlePostgresFactory {
  static create(connectionString: string): DrizzleConnection {
    const pool = new Pool({
      connectionString,
    });
    const baseConn = drizzle(pool, { schema: schemas });
    Object.setPrototypeOf(baseConn, DrizzleConnection.prototype);
    baseConn.$client = pool;
    return baseConn as DrizzleConnection;
  }
}
