'use client'

import React from "react";

export interface BreadcrumbProps {
  items?: Array<{ label: string; href?: string }>
  current: string
}

export const Breadcrumb = ({ items, current }: BreadcrumbProps) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#666'
  }}>
    <span>장소 관리</span>
    {items?.map((item, index) => (
      <React.Fragment key={index}>
        <span key={`separator-${index}`}>{'>'}</span>
        <span key={item.label}>{item.label}</span>
      </React.Fragment>
    ))}
    <span>{'>'}</span>
    <span style={{ color: '#333', fontWeight: '500' }}>{current}</span>
  </div>
)