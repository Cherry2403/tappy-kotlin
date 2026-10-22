import { readFileSync } from 'node:fs';

const readSecret = (name: string): string | undefined => {
  const value = process.env[name];
  const file = process.env[`${name}_FILE`];

  if (value && file) {
    throw new Error(`${name} and ${name}_FILE cannot both be set`);
  }

  return value ?? (file ? readFileSync(file, 'utf8').trim() : undefined);
};

const requireValue = (name: string, value: string | undefined) => {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

export const loadEnvironment = (config: Record<string, unknown>) => {
  const asString = (value: unknown): string | undefined =>
    typeof value === 'string' ? value : undefined;

  const serviceRole = asString(config.SERVICE_ROLE) ?? 'api';
  const publicSiteUrl = requireValue(
    'PUBLIC_SITE_URL',
    asString(config.PUBLIC_SITE_URL),
  );
  const redisHost = requireValue('REDIS_HOST', asString(config.REDIS_HOST));
  const redisPassword = requireValue(
    'REDIS_PASSWORD',
    asString(config.REDIS_PASSWORD) ?? readSecret('REDIS_PASSWORD'),
  );

  let siteUrl: URL;

  try {
    siteUrl = new URL(publicSiteUrl);
  } catch {
    throw new Error('PUBLIC_SITE_URL must be a valid URL');
  }

  if (process.env.NODE_ENV === 'production' && siteUrl.protocol !== 'https:') {
    throw new Error('PUBLIC_SITE_URL must use HTTPS in production');
  }

  const environment = {
    ...config,
    SERVICE_ROLE: serviceRole,
    PUBLIC_SITE_URL: siteUrl.toString(),
    REDIS_HOST: redisHost,
    REDIS_PORT: Number(process.env.REDIS_PORT ?? '6379'),
    REDIS_PASSWORD: redisPassword,
    PORT: config.PORT ?? '3000',
  };

  if (serviceRole !== 'worker') {
    return environment;
  }

  const gmail = requireValue('GMAIL', readSecret('GMAIL'));
  const gmailPassword = requireValue(
    'GMAIL_PASSWORD',
    readSecret('GMAIL_PASSWORD'),
  );
  const notifyEmail = requireValue('NOTIFY_EMAIL', readSecret('NOTIFY_EMAIL'));

  return {
    ...environment,
    GMAIL: gmail,
    GMAIL_PASSWORD: gmailPassword,
    NOTIFY_EMAIL: notifyEmail,
  };
};
