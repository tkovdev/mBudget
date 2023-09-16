import { PaidPipe } from './paid.pipe';

describe('PaidPipe', () => {
  it('create an instance', () => {
    const pipe = new PaidPipe();
    expect(pipe).toBeTruthy();
  });
});
