import styled from 'styled-components';

interface SwitchProps {
  height?: string;
  width?: string;
}

export const Switch = styled.div<SwitchProps>`
  -webkit-box-align: center;
  align-items: center;
  background: rgb(247, 248, 250);
  border: none;
  cursor: pointer;
  display: flex;
  outline: none;
  width: fit-content;
  position: relative;
  height: fit-content;
  background: var(--switch-bg);
  border-radius: 32px;
  padding: 2px;
  transition: 300ms all;

  &:before {
    transition: 300ms all;
    content: '';
    animation: 0.1s ease-in 0s 1 normal none running clieEQ;
    background: var(--primary-color);
    border-radius: 50%;
    width: ${(props) => props.height ?? '1rem'};
    height: ${(props) => props.height ?? '1rem'};
    margin: 0.1em 0.1em 0.1em ${(props) => props.width ?? '1em'};
  }

  &:before:hover {
    background: var(--primary-color-hover);
  }
`;

export const Input = styled.input<SwitchProps>`
  display: none;

  &:checked + ${Switch}:before {
    animation: 0.1s ease-in 0s 1 normal none running dXzLoA;
    background: rgb(110, 114, 125);
    border-radius: 50%;
    width: ${(props) => props.height ?? '1rem'};
    height: ${(props) => props.height ?? '1rem'};
    margin: 0.1em ${(props) => props.width ?? '1em'} 0.1em 0.1em;

    &:before {
      transform: translate(16px, -50%);
    }
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
`;
