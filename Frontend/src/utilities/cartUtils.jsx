const CART_KEY = 'guest_cart';

export const getGuestCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

export const setGuestCart = (items) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const clearGuestCart = () => {
    localStorage.removeItem(CART_KEY);
};