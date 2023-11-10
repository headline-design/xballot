// hooks/useLoadingState.ts
import { useState, useEffect } from 'react';
import { useNavigation } from 'react-router-dom';

const useLoadingState = (dataLoading: boolean): boolean => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
  }, [navigation.location]);

  useEffect(() => {
    setLoading(dataLoading);
  }, [dataLoading]);

  return loading;
};

export default useLoadingState;
