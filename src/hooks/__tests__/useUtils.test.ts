import { renderHook, act } from '@testing-library/react';
import { useDebounce, useLocalStorage, useLoading } from '@/hooks';

// Utility Hooks Tests
describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // Change value
    rerender({ value: 'changed', delay: 500 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now value should be updated
    expect(result.current).toBe('changed');
  });
});

describe('useLocalStorage', () => {
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    const [value] = result.current;

    expect(value).toBe('default');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('returns stored value when available', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    const [value] = result.current;

    expect(value).toBe('stored-value');
  });

  it('updates localStorage when setValue is called', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    const [, setValue] = result.current;

    act(() => {
      setValue('new-value');
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });
});

describe('useLoading', () => {
  it('returns loading state and control functions', () => {
    const { result } = renderHook(() => useLoading());
    const [isLoading, startLoading, stopLoading, setLoading] = result.current;

    expect(isLoading).toBe(false);
    expect(typeof startLoading).toBe('function');
    expect(typeof stopLoading).toBe('function');
    expect(typeof setLoading).toBe('function');
  });

  it('starts and stops loading', () => {
    const { result } = renderHook(() => useLoading());
    const [, startLoading, stopLoading] = result.current;

    act(() => {
      startLoading();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      stopLoading();
    });

    expect(result.current[0]).toBe(false);
  });

  it('sets loading state directly', () => {
    const { result } = renderHook(() => useLoading());
    const [, , , setLoading] = result.current;

    act(() => {
      setLoading(true);
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      setLoading(false);
    });

    expect(result.current[0]).toBe(false);
  });
});
