import React from 'react'
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Navbar from '../Navbar';

// __tests__/Navbar.test.jsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useClerk, useUser } from "@clerk/nextjs";
import "@testing-library/jest-dom";

// __tests__/Navbar.test.jsx
// Mocking Link component
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mocking useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mocking useUser hook
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  SignedIn: ({ children }) => <>{children}</>,
  SignedOut: ({ children }) => <>{children}</>,
  useClerk: jest.fn(),
}));

// Mocking axiosInstance
jest.mock("@/utils/axiosInstance", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mocking toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Navbar() Navbar method', () => {
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
    useClerk.mockReturnValue({ signOut: mockSignOut });
  });

  describe('Happy Paths', () => {
    it('should render the Navbar with links when user is signed in and has ADMIN role', async () => {
      // Mocking user as signed in with ADMIN role
      useUser.mockReturnValue({
        isSignedIn: true,
        user: { id: 'user123' },
      });

      axiosInstance.get.mockResolvedValueOnce({ data: { role: 'ADMIN' } });

      render(<Navbar />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    it('should render the Navbar with links when user is signed in and has USER role', async () => {
      // Mocking user as signed in with USER role
      useUser.mockReturnValue({
        isSignedIn: true,
        user: { id: 'user123' },
      });

      axiosInstance.get.mockResolvedValueOnce({ data: { role: 'USER' } });

      render(<Navbar />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.queryByText('Users')).not.toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    it('should render the Navbar with login link when user is signed out', () => {
      // Mocking user as signed out
      useUser.mockReturnValue({
        isSignedIn: false,
        user: null,
      });

      render(<Navbar />);

      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should handle logout correctly for Clerk login', async () => {
      // Mocking user as signed in
      useUser.mockReturnValue({
        isSignedIn: true,
        user: { id: 'user123' },
      });

      axiosInstance.get.mockResolvedValueOnce({ data: { role: 'USER' } });

      render(<Navbar />);

      fireEvent.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/login');
        expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle role fetch failure gracefully', async () => {
      // Mocking user as signed in
      useUser.mockReturnValue({
        isSignedIn: true,
        user: { id: 'user123' },
      });

      axiosInstance.get.mockRejectedValueOnce(new Error('Role fetch failed'));

      render(<Navbar />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.queryByText('Users')).not.toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    it('should handle logout failure gracefully', async () => {
      // Mocking user as signed in
      useUser.mockReturnValue({
        isSignedIn: true,
        user: { id: 'user123' },
      });

      axiosInstance.get.mockResolvedValueOnce({ data: { role: 'USER' } });
      mockSignOut.mockRejectedValueOnce(new Error('Logout failed'));

      render(<Navbar />);

      fireEvent.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Logout failed');
      });
    });
  });
});