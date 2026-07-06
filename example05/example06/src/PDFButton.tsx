import { BlobProvider } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react"
import {HiOutlinePrinter} from 'react-icons/hi';
import MyDocument from "./MyDocument";

const PDFButton = ({ cartId, type = 'carts' }: { cartId?: number | string; type?: 'carts' | 'orders' }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const id = cartId || localStorage.getItem("cartId");
            const token = localStorage.getItem('jwt-token');

            if (!id) {
                setError(new Error('No ID provided'));
                setLoading(false);
                return;
            }

            try {
                const url = type === 'orders'
                    ? `http://localhost:8080/api/public/users/${localStorage.getItem("globalEmailCart") || ''}/orders/${id}`
                    : `http://localhost:8080/api/admin/carts/${id}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : undefined,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                let result = await response.json();
                if (type === 'orders') {
                    result = {
                        cartId: result.orderId,
                        totalPrice: result.totalAmount,
                        products: (result.orderItems || []).map((item: any) => ({
                            productId: item.product?.productId || '',
                            productName: item.product?.productName || '',
                            price: item.orderedProductPrice || item.product?.specialPrice || item.product?.price || 0,
                            quantity: item.quantity || 1
                        }))
                    };
                }
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [cartId, type]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message || String(error)}</div>;

    const styles = {
        btn: {
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            fontSize: '12px',
            color: '#ffd700',
            fontWeight: 700,
            cursor: 'pointer',
            userSelect: 'none',
            backgroundColor: '#ffd70000',
            textDecoration: 'none',
            transition: 'background-color 0.3s, color 0.3s',
        },
        hover: {
            backgroundColor: '#ffd70010'
        }
    }
    const handleMouseEnter = (e: any) => {
        e.currentTarget.style.backgroundColor = styles.hover.backgroundColor;
        e.currentTarget.style.color = styles.hover.color;
    };
    const handleMouseLeave = (e: any) => {
        e.currentTarget.style.backgroundColor = styles.btn.backgroundColor as any;
        e.currentTarget.style.color = styles.btn.color as any;
    };
    return (
        <BlobProvider document={<MyDocument data ={data} />}>
            {({ url }) => (
                <a
                    href = {url}
                    target = "_blank"
                    rel="noreferrer"
                    style = {styles.btn}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave} >
                    <HiOutlinePrinter size={17} />
                    <span style={{ textDecoration: 'none' }}>PRINT</span>
                </a>
            )}
        </BlobProvider >
    )
}
export default PDFButton;