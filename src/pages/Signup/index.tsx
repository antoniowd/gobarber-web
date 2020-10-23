import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

const Signup: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();


  const handleSubmit = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is a required field'),
        email: Yup.string().required('Email is a required field').email('Email must be a valid email'),
        password: Yup.string().min(6, 'Password must be at least 6 characters'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      history.push('/');

      addToast({
        type: 'success',
        title: 'Register complete',
        description: 'Now, you can login to GoBarber',
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
  }, [addToast, history]);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Sign up to GoBarber</h1>

            <Input name="name" icon={FiUser} placeholder="Name" />

            <Input name="email" icon={FiMail} placeholder="Email" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Button type="submit">Register</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
          Log in
        </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Signup;
