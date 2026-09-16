import { useEffect, useRef } from 'react';
import {useMetaData} from "@/app/hooks/useMetaData.ts";

// Strong types for the expected message payload from Apps Script
interface BookingMessage {
    type: 'BOOKING_SUCCESS' | 'BOOKING_ERROR';
    bookingId?: string;
    message?: string;
}

export function BookingPage() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    useMetaData(
        "Booking Portal | Unlock Her Tech",
        "Book your spot with Unlock Her Tech today!",
        "https://unlockhertech.com/private-booking-portal",
        {
            image: "/logo.png",
            type: "website",
        }
    );

    useEffect(() => {
        // 1. Dynamic Meta Tag Injection to prevent SEO indexing
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);

        // 2. Strongly typed Message Listener from Apps Script
        const handleMessage = (event: MessageEvent) => {
            // With sandboxed iframe (no allow-same-origin), origin is 'null'.
            // Verify the sender by matching the iframe's contentWindow and acceptable origin.
            const fromIframe = event.source === iframeRef.current?.contentWindow;
            const acceptableOrigin = event.origin === 'null' || event.origin === window.location.origin;
            if (!fromIframe || !acceptableOrigin) return;

            const data = event.data as BookingMessage;

            // Handle the booking response actions
            if (data.type === 'BOOKING_SUCCESS') {
                alert(`Success! Your booking ID is: ${data.bookingId}`);
            }
        };

        window.addEventListener('message', handleMessage);

        // Clean up listeners and tags on unmount
        return () => {
            meta.remove();
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden', margin: 0, padding: 0 }}>
            <iframe
                ref={iframeRef}
                src="/api/booking-portal"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Secure Booking System"
                sandbox="allow-scripts allow-forms"
            />
        </div>
    );
}
