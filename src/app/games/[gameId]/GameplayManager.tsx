'use client'

import { useRouter } from 'next/router';

export default function GameplayManager() {
    const router = useRouter();

    return (
        <p>In game {router.query.slug}</p>
    )
}