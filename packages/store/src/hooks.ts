import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * 类型化的 useDispatch hook
 * 使用此 hook 代替普通的 useDispatch
 * 
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(addLink({ name: 'Example', url: 'https://example.com' }));
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * 类型化的 useSelector hook
 * 使用此 hook 代替普通的 useSelector
 * 
 * @example
 * const links = useAppSelector((state) => state.links.items);
 * const theme = useAppSelector((state) => state.settings.theme);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
