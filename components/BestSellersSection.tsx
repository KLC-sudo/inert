import React from 'react';
import { useContent } from '../ContentContext';
import { useCart, productToCartItem } from '../CartContext';

const BestSellersSection: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { content } = useContent();
    const { addToCart } = useCart();
    const bs = content.bestSellers;

    if (!bs || bs.products.length === 0) return null;

    return (
        <section className="bg-white py-20 px-6 lg:px-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900">{bs.title}</h2>
                    <div className="mt-3 mx-auto w-16 h-1 bg-red-600 rounded-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {bs.products.map((p, i) => (
                        <div key={i} className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                            {p.badge && (
                                <span className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                                    {p.badge}
                                </span>
                            )}
                            <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                                {p.image ? (
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-300 p-6 text-center">
                                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs">Add image via CMS</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <p className="font-semibold text-gray-900 text-sm flex-1">{p.name}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-base font-bold text-red-600">{p.price}</span>
                                    <button
                                        onClick={() => addToCart(productToCartItem(p))}
                                        className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors hover:scale-110"
                                        title="Add to cart"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <button
                        onClick={() => onNavigate('shop')}
                        className="text-red-600 font-semibold hover:underline inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        View E-Shop →
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BestSellersSection;
