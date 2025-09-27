import React from 'react';
import ScrollToTopButton from './ScrollToTopButton';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
      <ScrollToTopButton />
    </div>
  );
};

export default PageWrapper;
