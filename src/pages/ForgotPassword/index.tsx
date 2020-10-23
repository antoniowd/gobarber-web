import React, { useRef, useCallback, useState } from 'react';
import { Link } from "react-router-dom";
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('Email is a required field').email('Email must be a valid email'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/password/forgot-password', {
        email: data.email,
      });

      addToast({
        type: 'success',
        title: 'Recover password',
        description: 'We sent you an email to confirm your account. Check your invoice',
      });

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err));
        return;
      }
      addToast({
        type: 'error',
        title: 'Authentication error',
        description: 'Forgot password error',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recover my password</h1>

            <Input name="email" icon={FiMail} placeholder="Email" />

            <Button loading={loading} type="submit">Recover</Button>

          </Form>
          <Link to="/signin">
            <FiLogIn />
            Back to Login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
