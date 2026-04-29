import React, { useState } from "react";
import { Truck, Star, X } from "lucide-react";

const OrderActions = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    console.log("Submitted Review:", { rating, review });
    // 🔥 Here you can call API to save review
    setIsModalOpen(false);
    setRating(0);
    setReview("");
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Truck className="h-4 w-4" />
          <span>Need help? Contact support</span>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Track Order
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Download Invoice
          </button>
          {order.status.toLowerCase() === "delivered" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Star className="h-4 w-4" /> <span>Rate & Review</span>
            </button>
          )}
        </div>
      </div>

      {/* ⭐ Rating Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rate & Review Order
            </h3>

            {/* Star Rating */}
            <div className="flex space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    (hover || rating) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>

            {/* Textbox */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500"
              placeholder="Write your review here..."
            ></textarea>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderActions;
