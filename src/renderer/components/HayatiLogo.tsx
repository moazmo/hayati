import React from 'react';
import styled from 'styled-components';

interface LogoProps {
  size?: number;
  color?: string;
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const TextContainer = styled.div<{ size: number; color: string }>`
  font-family: 'Cairo', sans-serif;
  font-size: ${props => props.size * 0.6}px;
  color: ${props => props.color};
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ArabicText = styled.span<{ size: number }>`
  font-size: ${props => props.size * 0.8}px;
`;

const EnglishText = styled.span<{ size: number }>`
  font-size: ${props => props.size * 0.4}px;
  opacity: 0.7;
`;

const FullLogoContainer = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  gap: ${props => props.size * 0.3}px;
`;

const TextColumn = styled.div<{ color: string }>`
  font-family: 'Cairo', sans-serif;
  color: ${props => props.color};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MainTitle = styled.span<{ size: number }>`
  font-size: ${props => props.size * 0.6}px;
  font-weight: bold;
  line-height: 1;
`;

const Tagline = styled.span<{ size: number }>`
  font-size: ${props => props.size * 0.3}px;
  opacity: 0.7;
  line-height: 1;
`;

export const HayatiLogo: React.FC<LogoProps> = ({ 
  size = 40, 
  color = '#00796B',
  variant = 'full',
  className 
}) => {
  const iconOnly = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="hayatiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00796B" />
          <stop offset="50%" stopColor="#4DB6AC" />
          <stop offset="100%" stopColor="#80CBC4" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#F7931E" />
        </linearGradient>
      </defs>
      
      {/* Main circle background */}
      <circle cx="50" cy="50" r="45" fill="url(#hayatiGradient)" />
      
      {/* Islamic geometric pattern */}
      <g transform="translate(50,50)">
        {/* Center star */}
        <path
          d="M0,-20 L5.88,-6.18 L19.1,-6.18 L9.51,2.36 L15.39,16.18 L0,7.64 L-15.39,16.18 L-9.51,2.36 L-19.1,-6.18 L-5.88,-6.18 Z"
          fill="white"
          opacity="0.9"
        />
        
        {/* Surrounding crescents representing life aspects */}
        <g>
          {[0, 72, 144, 216, 288].map((angle, index) => (
            <g key={index} transform={`rotate(${angle})`}>
              <path
                d="M0,-35 Q-8,-28 0,-20 Q8,-28 0,-35"
                fill="url(#accentGradient)"
                opacity="0.8"
              />
            </g>
          ))}
        </g>
        
        {/* Inner dots for balance */}
        <circle cx="0" cy="0" r="3" fill="white" />
        {[0, 60, 120, 180, 240, 300].map((angle, index) => (
          <g key={index} transform={`rotate(${angle})`}>
            <circle cx="0" cy="-12" r="1.5" fill="white" opacity="0.7" />
          </g>
        ))}
      </g>
    </svg>
  );

  const textOnly = (
    <TextContainer size={size} color={color} className={className}>
      <ArabicText size={size}>حياتي</ArabicText>
      <EnglishText size={size}>Hayati</EnglishText>
    </TextContainer>
  );

  const fullLogo = (
    <FullLogoContainer size={size} className={className}>
      {iconOnly}
      <TextColumn color={color}>
        <MainTitle size={size}>حياتي</MainTitle>
        <Tagline size={size}>نظم حياتك بذكاء</Tagline>
      </TextColumn>
    </FullLogoContainer>
  );

  switch (variant) {
    case 'icon':
      return iconOnly;
    case 'text':
      return textOnly;
    case 'full':
    default:
      return fullLogo;
  }
};

export default HayatiLogo;
