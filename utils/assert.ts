type AssertNonNullable = <T>(val: T) => asserts val is NonNullable<T>;

export const assertIsDefined: AssertNonNullable = val => {
  if (val === undefined || val === null) {
    throw new Error(
      `Expected 'val' to be defined, but received ${val}`
    );
  }
}