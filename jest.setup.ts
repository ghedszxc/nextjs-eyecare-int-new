import "@testing-library/jest-dom";

global.Request = jest.fn().mockImplementation(() => ({
  // Mock any properties or methods you need for your tests.
  headers: { get: jest.fn() },
  method: "GET",
  url: "/",
}));

global.Response = jest.fn().mockImplementation(() => ({})) as any;

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
