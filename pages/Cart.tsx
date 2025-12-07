
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-dark-900 mb-4">Ваша корзина пуста</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Похоже, вы еще не выбрали ни одного эксклюзивного украшения. Самое время исправить это.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold rounded-full hover:brightness-110 transition-colors shadow-lg"
        >
          Перейти к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-dark-900 mb-8">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-6 border border-gray-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full sm:w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-serif font-bold text-lg text-dark-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-gold-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                    className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                    className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  title="Удалить"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <button 
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 underline"
            >
              Очистить корзину
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
              <h3 className="text-xl font-serif font-bold mb-6">Итого</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Товары ({cart.length})</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span className="text-green-600">Бесплатно</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-dark-900">К оплате</span>
                  <span className="text-2xl font-bold text-gold-600">{formatPrice(total)}</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold py-4 rounded-full hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-400/20">
                Оформить заказ
                <ArrowRight size={20} />
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                Нажимая кнопку, вы соглашаетесь с условиями оферты.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
