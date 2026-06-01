import { useIALabStore as rawStore } from '../../../store/ialabStore';
import type { IALabStore } from '@/components/IALab/types';

type StoreSelector = <T>(selector: (state: IALabStore) => T) => T;

export const useIALabStore = rawStore as unknown as StoreSelector & {
  getState: () => IALabStore;
  setState: (partial: Partial<IALabStore> | ((state: IALabStore) => Partial<IALabStore>)) => void;
  subscribe: (listener: (state: IALabStore, prevState: IALabStore) => void) => () => void;
  destroy: () => void;
};

export { useIALabStore as default };
