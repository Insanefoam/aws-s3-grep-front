import { validateCredentials } from 'api';
import { TextField } from 'components';
import { useAsyncCallback } from 'hooks';
import React from 'react';
import { Field, Form } from 'react-final-form';
import LocalStorage from 'services/LocalStorage';
import { AwsCredentials } from 'types';
import { Button } from 'UI';
import { isRequired } from 'utils';
import styles from './AuthForm.module.scss';

type FormValues = {
  secret: string;
  access: string;
  region: string;
};

function AuthForm() {
  const handleSubmit = async (values: FormValues) => {
    const credentials: AwsCredentials = {
      AwsSecret: values.secret,
      AwsAccess: values.access,
      AwsRegion: values.region,
    };

    const { data: isValid } = await validateCredentials(credentials);

    if (isValid) {
      Object.keys(credentials).forEach((key) => {
        LocalStorage.setItem(key, credentials[key]);
      });
      return undefined;
    }

    alert('Wrong credentials');
  };

  const [asyncSubmit, isLoading] = useAsyncCallback(handleSubmit);

  return (
    <Form<FormValues>
      onSubmit={asyncSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field
            label="AWS Secret Key"
            name="secret"
            validate={isRequired()}
            component={TextField}
          />
          <Field
            label="AWS Access Key"
            name="access"
            validate={isRequired()}
            component={TextField}
          />
          <Field
            label="AWS Region"
            name="region"
            validate={isRequired()}
            component={TextField}
          />
          <Button type="submit" disabled={isLoading}>
            Log in
          </Button>
        </form>
      )}
    />
  );
}

export default AuthForm;
