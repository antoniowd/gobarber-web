import React, { useRef, useCallback } from 'react';
import { Link, useHistory } from "react-router-dom";
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from "../../hooks/auth";
import { useToast } from '../../hooks/toast';

interface SignInFormData {
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('Email is a required field').email('Email must be a valid email'),
        password: Yup.string().required('Password is a required field'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn({
        email: data.email,
        password: data.password,
      });

      history.push('/dashboard');

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err));
        return;
      }
      addToast({
        type: 'error',
        title: 'Authentication error',
        description: 'Login error, check your credentials',
      });
    }
  }, [signIn, addToast, history]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Log in to GoBarber</h1>

            <Input name="email" icon={FiMail} placeholder="Email" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Button type="submit">Enter</Button>

            <Link to="/forgot-password">Forgot my password</Link>
          </Form>
          <Link to="/register">
            <FiLogIn />
          Create an account
        </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default Signin;
