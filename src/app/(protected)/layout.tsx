"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../components/SideBar';
export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                <Sidebar></Sidebar>
                {children}
            </div>
        </>
    );
}
