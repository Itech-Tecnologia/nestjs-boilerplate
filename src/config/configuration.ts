import * as Joi from '@hapi/joi';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const configuration = () => ({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'staging')
      .default('development'),
    PORT: Joi.number().default(3333),
    APP_NAME: Joi.string().default('Cotai'),
    APP_KEY: Joi.string().required(),
    SALT_HASH_PASSWORD: Joi.number().default(10),
    JWT_EXPIRES: Joi.string().required(),
    DB_CONNECTION: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_DATABASE: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
  }),
  validationOptions: {
    abortEarly: true,
  },
});
