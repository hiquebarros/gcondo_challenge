import { useCallback, useRef } from 'react';

/**
 * Returns a callback that runs after `delay` ms of no further invocations.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
    callback: T,
    delay: number,
): T {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const debounced = useCallback(
        ((...args: Parameters<T>) => {
            if (timeoutRef.current != null) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                timeoutRef.current = null;
                callbackRef.current(...args);
            }, delay);
        }) as T,
        [delay],
    );

    return debounced;
}
