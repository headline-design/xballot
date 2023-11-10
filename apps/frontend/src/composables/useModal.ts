import { useState } from 'react';

export function useModal() {
  const [modalAccountOpen, setModalAccountOpen] = useState(false);
  const [isModalPostVoteOpen, setIsModalPostVoteOpen] = useState(false);
  const [isModalVoteOpen, setIsModalVoteOpen] = useState(false);
  const [isModalPostCreateProposalOpen, setIsModalPostCreateProposalOpen] = useState(false);

  return {
    modalAccountOpen,
    setModalAccountOpen,
    isModalVoteOpen,
    setIsModalVoteOpen,
    isModalPostVoteOpen,
    setIsModalPostVoteOpen,
    isModalPostCreateProposalOpen,
    setIsModalPostCreateProposalOpen,
  };
}
