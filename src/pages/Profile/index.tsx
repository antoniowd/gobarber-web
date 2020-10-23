import React, { useCallback, useRef, ChangeEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { Container, Content, AvatarInput } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);

        api.patch('users/avatar', data).then(response => {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar was updated',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is a required field'),
          email: Yup.string()
            .required('Email is a required field')
            .email('Email must be a valid email'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required().min(6),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required().min(6),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password')], 'Passwords must match'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          password,
          old_password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Update complete',
          description: 'The profile was successfully updated',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }
        addToast({
          type: 'error',
          title: 'Register Error',
        });
      }
    },
    [addToast, history, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>My Profile</h1>

          <Input name="name" icon={FiUser} placeholder="Name" />

          <Input name="email" icon={FiMail} placeholder="Email" />

          <Input
            containerStyle={{
              marginTop: 24,
            }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Current password"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="New password"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirm password"
          />

          <Button type="submit">Save changes</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
