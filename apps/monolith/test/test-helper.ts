import { Test, TestingModule } from '@nestjs/testing';
import { CallHandler, ExecutionContext, INestApplication, Injectable, NestInterceptor } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Observable, tap } from 'rxjs';

@Injectable()
class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    console.log(`[REQUEST] ${method} ${url}\nBody: ${JSON.stringify(body, null, 2)}`);

    return next.handle().pipe(
      tap((responseBody) => {
        const response = context.switchToHttp().getResponse();
        console.log(`[RESPONSE] ${response.statusCode}\nBody: ${JSON.stringify(responseBody, null, 2)}`);
      }),
    );
  }
}

export class TestHelper {
  private app: INestApplication;
  private dataSource: DataSource;

  async createApplication(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalInterceptors(new LoggingInterceptor());
    await this.app.init();

    this.dataSource = this.app.get(DataSource);
    return this.app;
  }

  async closeApplication(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
  }

  async cleanupDatabase(): Promise<void> {
    const entities = this.dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.query(`SET FOREIGN_KEY_CHECKS = 0;`);
      await repository.query(`TRUNCATE TABLE \`${entity.tableName}\`;`);
      await repository.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
