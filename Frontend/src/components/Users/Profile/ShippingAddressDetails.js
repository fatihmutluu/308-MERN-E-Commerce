import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ShippingAddressDetails({ shippingAddress }) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="relative">
      <div className="h-56 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://images.pexels.com/photos/6348105/pexels-photo-6348105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:ml-auto md:w-1/2 md:pl-10">
          <p className="mt-2 text-2xl font-medium tracking-tight text-gray-600 sm:text-3xl">
            Shipping Address 
          </p>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 text-sm font-medium text-cyan-600 hover:text-cyan-800"
          >
            {showDetails ? 'Hide' : 'Show'} Address Details
          </button>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
              >  
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.1 }}
                >
                  <b>Full Name:</b> {shippingAddress?.firstName} {shippingAddress?.lastName}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.1 }}
                >
                  <b>Address:</b> {shippingAddress?.address} 
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.1 }}
                >  
                  <b>City:</b> {shippingAddress?.city}  
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.1 }}
                >  
                  <b>Country:</b> {shippingAddress?.country}  
                </motion.p> 
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.1 }}
                >
                  <b>Phone:</b> {shippingAddress?.phone} 
                </motion.p> 
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.1 }}
                >
                  <b>Postal code:</b> {shippingAddress?.postalCode} 
                </motion.p> 
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}