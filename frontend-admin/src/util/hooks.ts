export const useUpdateState = <T>(
  setState: React.Dispatch<React.SetStateAction<T>>
) => {
  return (newState: Partial<T>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };
};
export const useUpdateStateWithCallback = <T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  callback: () => void
) => {
  return (newState: Partial<T>) => {
    setState((prev) => ({ ...prev, ...newState }));
    callback();
  };
};
