import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Logout button', () => {
  render(<App />);
  const logoutElement = screen.getByText('LOGIN');
  expect(logoutElement).toBeInTheDocument();
});
