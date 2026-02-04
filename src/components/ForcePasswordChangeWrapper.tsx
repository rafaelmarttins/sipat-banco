import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ForcePasswordChangeModal from '@/components/modals/ForcePasswordChangeModal';

const ForcePasswordChangeWrapper: React.FC = () => {
  const { user, passwordResetRequired, clearPasswordResetRequired } = useAuth();

  if (!user || !passwordResetRequired) {
    return null;
  }

  return (
    <ForcePasswordChangeModal
      open={passwordResetRequired}
      userId={user.id}
      onPasswordChanged={clearPasswordResetRequired}
    />
  );
};

export default ForcePasswordChangeWrapper;
