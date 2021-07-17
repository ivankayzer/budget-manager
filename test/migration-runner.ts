import { getConnection, Connection } from 'typeorm';

export class MigrationRunner {
  private connection: Connection;
  private migrationsAppliedCount: number;

  constructor() {
    this.connection = getConnection();
  }

  public async migrate() {
    const runMigrations = await this.connection.runMigrations({
      transaction: 'none',
    });

    this.migrationsAppliedCount = runMigrations.length;
  }

  public async undo() {
    while (this.migrationsAppliedCount > 0) {
      await this.connection.undoLastMigration({ transaction: 'none' });
      this.migrationsAppliedCount--;
    }
  }
}
