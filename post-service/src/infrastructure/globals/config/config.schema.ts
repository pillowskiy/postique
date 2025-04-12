import { plainToInstance, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { resolve } from 'path';

export class Config {
  static validate(config: Record<string, unknown>): Config {
    const configInstance = plainToInstance(Config, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(configInstance);
    if (errors?.length > 0) {
      const formatted = errors.map((e) => {
        const key = e.property;
        const constraint = Object.values(e.constraints ?? []).at(-1);
        const message = constraint ?? 'Unknown constraint';
        return `\t- ${key}: ${message}`;
      });

      throw new Error(`Config validation failed. \n${formatted.join('\n')}`);
    }

    return configInstance;
  }

  @Transform(({ value }) => parseInt(value as string, 10), {
    toClassOnly: true,
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Must be a number' },
  )
  @Max(65535, { message: 'Must be less than 65535' })
  @Min(0, { message: 'Must be greater than 0' })
  PORT: number;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  @Length(3, 50, {
    message: 'Must be between 3 and 50 characters long',
  })
  RABBIT_MQ_USERS_QUEUE: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  @Length(3, 50, {
    message: 'Must be between 3 and 50 characters long',
  })
  RABBIT_MQ_USERS_EXCHANGE: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  @Matches(/^amqp:\/\/.*$/, {
    message:
      'Must be a valid RabbitMQ URI (e.g., amqp://username:password@host:port)',
  })
  RABBIT_MQ_USERS_URL: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  @Matches(/^mongodb(\+srv)?:\/\/.*/, {
    message:
      'Must be a valid MongoDB URI (e.g., mongodb://username:password@host:port)',
  })
  MONGO_URI: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  MONGO_REPLICA_SET: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  SSO_URL: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  @Transform(
    ({ value }) =>
      resolve(__dirname, '../../../../../', (value as string) ?? ''),
    {
      toClassOnly: true,
    },
  )
  PROTO_PATH: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  @Transform(
    ({ value }) =>
      resolve(__dirname, '../../../../../', (value as string) ?? ''),
    {
      toClassOnly: true,
    },
  )
  JWT_KEY_PATH: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  JWT_ALG: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @IsString({ message: 'Must be a string' })
  JWT_CRV: string;
}
