import { useState } from 'react';

function PaymentModal({ isOpen, onClose, onPaymentSuccess, coursePrice }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate payment processing delay
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-base-100 p-8 rounded-3xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        >✕</button>
        
        <h2 className="text-2xl font-bold mb-2">Secure Checkout 💳</h2>
        <p className="text-base-content/60 mb-6">Total due: <span className="text-primary font-bold text-lg">${coursePrice || '49.00'}</span></p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Card Number</span></label>
            <input 
              type="text" 
              placeholder="0000 0000 0000 0000" 
              className="input input-bordered focus:border-primary transition-colors"
              required 
              maxLength="19"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="form-control flex-1">
              <label className="label"><span className="label-text font-medium">Expiry Date</span></label>
              <input 
                type="text" 
                placeholder="MM/YY" 
                className="input input-bordered focus:border-primary transition-colors" 
                required 
                maxLength="5"
              />
            </div>
            <div className="form-control flex-1">
              <label className="label"><span className="label-text font-medium">CVC</span></label>
              <input 
                type="text" 
                placeholder="123" 
                className="input input-bordered focus:border-primary transition-colors" 
                required 
                maxLength="4"
              />
            </div>
          </div>
          
          <div className="form-control mt-2">
            <label className="label"><span className="label-text font-medium">Cardholder Name</span></label>
            <input 
              type="text" 
              placeholder="John Doe" 
              className="input input-bordered focus:border-primary transition-colors" 
              required 
            />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button 
            type="submit" 
            className="btn btn-primary mt-4 w-full shadow-lg shadow-primary/30"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : `Pay $${coursePrice || '49.00'} & Enroll`}
          </button>
          
          <p className="text-xs text-center text-base-content/40 mt-2 flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Payments are securely processed. (Demo mode)
          </p>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
