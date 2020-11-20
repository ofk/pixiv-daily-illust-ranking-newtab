export const storage = {
  isExpired<T = unknown>(data: { value: T; expire?: string } | null): boolean {
    return !!data && !!data.expire && new Date(data.expire).getTime() <= Date.now();
  },
  getRawData<T = unknown>(key: string): T | null {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : null;
  },
  get<T = unknown>(key: string, force = false): T | null {
    let data = this.getRawData<{ value: T; expire?: string }>(key);
    if (!force && this.isExpired(data)) {
      data = null;
    }
    return data && 'value' in data ? data.value : data;
  },
  setRawData<T = unknown>(key: string, val: T): void {
    localStorage.setItem(key, JSON.stringify(val));
  },
  set<T = unknown>(key: string, value: T, expire?: Date | number | null): void {
    const data = { value } as { value: T; expire?: string };
    if (expire) {
      if (expire instanceof Date) {
        data.expire = expire.toString();
      } else if (typeof expire === 'number') {
        data.expire = new Date(Date.now() + expire).toString();
      } else {
        throw new Error('invalid expire type');
      }
    }
    this.setRawData(key, data);
  },
  fetch<T = unknown>(
    key: string,
    expire: Date | number | null,
    request: () => Promise<T>
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const data = this.getRawData<{ value: T; expire?: string }>(key);
      if (data) {
        resolve(data.value);
      }
      if (!data || this.isExpired(data)) {
        request().then(
          (value) => {
            this.set(key, value, expire);
            if (!data) resolve(value);
          },
          (err) => {
            if (!data) {
              reject(err);
            } else {
              this.set(key, data.value, expire);
            }
          }
        );
      }
    });
  },
  clear(key: string): void {
    localStorage.removeItem(key);
  },
};
