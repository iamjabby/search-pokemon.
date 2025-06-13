// jest.setup.js
// import '@testing-library/jest-dom'; 

require('@testing-library/jest-dom');

// Exaple: Mock Test Next.js Image component
// jest.mock('next/image', () => ({
//   __esModule: true,
//   default: (props) => {
//     // eslint-disable-next-line @next/next/no-img-element
//     return <img {...props} />;
//   },
// }));

// Example: Mock Test Next.js Router (useRouter, useSearchParams)
// jest.mock('next/navigation', () => ({
//   useRouter: jest.fn(() => ({
//     push: jest.fn(),
//     replace: jest.fn(),
//     reload: jest.fn(),
//     back: jest.fn(),
//     prefetch: jest.fn(),
//     events: {
//       on: jest.fn(),
//       off: jest.fn(),
//       emit: jest.fn(),
//     },
//     isFallback: false,
//   })),
//   useSearchParams: jest.fn(() => new URLSearchParams()),
//   // usePathname: jest.fn(() => '/mock-path'),
//   // useServerInsertedHTML: jest.fn(),
// }));

// Example: Mock Test fetch API 
// jest.mock('node-fetch', () => jest.fn()); 
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({ success: true }),
//   })
// );