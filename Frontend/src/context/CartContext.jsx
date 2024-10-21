import React, { createContext, useContext, useState, useMemo } from 'react';
import { fetchWithToken } from '../services/fetchWithToken';
import { getGuestCart, setGuestCart } from '../Utilities/cartUtils';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = getGuestCart();
        return savedCart;
    });

    // Calculate total amount using useMemo to optimize performance
    const totalAmount = useMemo(() =>
        cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0),
        [cartItems]);

    const fetchCartItems = async (token) => {
        if (token) {
            const items = await fetchWithToken('/cart/items', 'GET');
            if (JSON.stringify(cartItems) !== JSON.stringify(items)) {
                setCartItems(items);
            }
        } else {
            const guestCart = getGuestCart();
            if (JSON.stringify(cartItems) !== JSON.stringify(guestCart)) {
                setCartItems(guestCart);
            }
        }
    };

    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(i => i.product_id === item.product_id);
            if (existingItemIndex > -1) {
                return prevItems.map((i, index) => {
                    if (index === existingItemIndex) {
                        return { ...i, quantity: i.quantity + item.quantity };
                    }
                    return i;
                });
            }
            return [...prevItems, item];
        });

        // Update guest cart in local storage
        const updatedGuestCart = cartItems.map(cartItem =>
            cartItem.product_id === item.product_id
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
        );
        if (!updatedGuestCart.some(cartItem => cartItem.product_id === item.product_id)) {
            updatedGuestCart.push(item);
        }
        setGuestCart(updatedGuestCart);
    };

    const updateItemQuantity = async (productId, newQuantity, token) => {
        if (token) {
            await fetchWithToken('/cart/items', 'POST', { product_id: productId, quantity: newQuantity });
        }

        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item =>
                item.product_id === productId ? { ...item, quantity: newQuantity } : item
            );
            if (!token) {
                setGuestCart(updatedItems);
            }
            return updatedItems;
        });
    };

    const removeFromCart = async (productId, token) => {
        if (token) {
            try {
                await fetchWithToken(`/cart/items/${productId}`, 'DELETE');
                setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
            } catch (error) {
                console.error('Error removing item:', error);
            }
        } else {
            setCartItems(prevItems => {
                const updatedItems = prevItems.filter(item => item.product_id !== productId);
                setGuestCart(updatedItems);
                return updatedItems;
            });
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, fetchCartItems, addToCart, removeFromCart, updateItemQuantity, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);